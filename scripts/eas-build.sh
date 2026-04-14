#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# scripts/eas-build.sh
#
# One-shot pipeline to authenticate, link and build the FINANCE2 app on EAS.
#
# IMPORTANT: this script MUST run from a machine with outbound access to
# api.expo.dev — NOT from the Claude Code Codespace, whose egress filter
# blocks that host (HTTP 403 x-deny-reason: host_not_allowed).
#
# Prerequisites:
#   - Node 20+ and npm available on PATH (EAS CLI is run via `npx`).
#   - The repo is checked out and `npm install --legacy-peer-deps` has been
#     done at least once.
#   - An Expo access token exported as EXPO_TOKEN (see below).
#
# Usage:
#   export EXPO_TOKEN="your-personal-access-token"
#   ./scripts/eas-build.sh                    # defaults: profile=development, platform=ios
#   ./scripts/eas-build.sh preview            # profile=preview, platform=ios
#   ./scripts/eas-build.sh production all     # both platforms
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

PROFILE="${1:-development}"
PLATFORM="${2:-ios}"

# ─── 1. Check EXPO_TOKEN ─────────────────────────────────────────────────────
#
# There is no `eas login --token <value>` subcommand. The eas-cli reads
# EXPO_TOKEN from the environment and uses it for every authenticated call,
# which is the official pattern for CI / scripted builds. Setting the env var
# IS the equivalent of being logged in.
#
# Generate a token at: https://expo.dev/settings/access-tokens
# ─────────────────────────────────────────────────────────────────────────────
if [ -z "${EXPO_TOKEN:-}" ]; then
  cat <<'EOF' >&2
✗ EXPO_TOKEN is not set.

  Export your personal access token first:

      export EXPO_TOKEN="<your-token>"

  Then re-run this script. Generate a token at:

      https://expo.dev/settings/access-tokens
EOF
  exit 1
fi

export EXPO_TOKEN

echo "──────────────────────────────────────────────────────────────────────"
echo "  FINANCE2 · EAS build pipeline"
echo "  profile  : $PROFILE"
echo "  platform : $PLATFORM"
echo "──────────────────────────────────────────────────────────────────────"
echo ""

# ─── 2. Verify authentication ────────────────────────────────────────────────
echo "→ eas whoami"
npx --yes eas-cli whoami
echo ""

# ─── 3. Link the project on expo.dev ─────────────────────────────────────────
#
# `eas init` writes extra.eas.projectId into app.json. It's idempotent but we
# skip the call if the id is already present, to keep subsequent runs silent.
# ─────────────────────────────────────────────────────────────────────────────
if grep -q '"projectId"' app.json 2>/dev/null; then
  echo "→ eas init (skipped — extra.eas.projectId already present)"
else
  echo "→ eas init"
  npx --yes eas-cli init --non-interactive --force
fi
echo ""

# ─── 4. Validate / generate eas.json ─────────────────────────────────────────
#
# No-op if eas.json already exists and is valid (ours is committed).
# ─────────────────────────────────────────────────────────────────────────────
echo "→ eas build:configure --platform $PLATFORM"
npx --yes eas-cli build:configure --platform "$PLATFORM"
echo ""

# ─── 5. Launch the build ─────────────────────────────────────────────────────
#
# First iOS build will prompt to:
#   - sign into an Apple Developer account (or supply an ASC API key)
#   - register the target iPhone UDID (ad-hoc distribution)
#   - generate / reuse distribution certificate + provisioning profile
#
# Run INTERACTIVELY the very first time so those prompts can appear.
# Once credentials are stored on EAS, re-run with `--non-interactive` to
# skip all prompts on subsequent builds.
# ─────────────────────────────────────────────────────────────────────────────
echo "→ eas build --profile $PROFILE --platform $PLATFORM"
echo ""
echo "  (First iOS build on this account will prompt for Apple Developer"
echo "   credentials. Accept the prompts to let EAS provision certificates"
echo "   and register your device.)"
echo ""

npx --yes eas-cli build --profile "$PROFILE" --platform "$PLATFORM"

echo ""
echo "──────────────────────────────────────────────────────────────────────"
echo "  ✓ Build submitted. Track progress on expo.dev."
echo "  Install link / QR will be printed above when the build finishes."
echo "──────────────────────────────────────────────────────────────────────"
