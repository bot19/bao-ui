# satelle operator verbs — short commands for the things only you can do.
#
# These are shell functions, not satelle commands. satelle has no `approve`
# verb; it has `satelle story record <id> --file F`, which wants a file. These
# wrappers write the file for you and remove nothing else.
#
# They live in the repo so a clone carries them. They are repo-agnostic: each
# one shells out to `satelle`, which resolves the repo from your current
# directory, so one loaded copy serves every satelle repo you cd into.
#
# ---------------------------------------------------------------- install
#
# Once per machine. Put the loader in your home directory:
#
#   mkdir -p ~/.satelle
#   cp .satelle/operator-loader.sh ~/.satelle/approve.sh
#
# then add this line to ~/.zshrc (~/.bashrc for bash):
#
#   [ -f "$HOME/.satelle/approve.sh" ] && . "$HOME/.satelle/approve.sh"
#
# Open a new terminal. From then on, cd into any repo that carries a
# .satelle/operator.sh and the verbs below are there.
#
# Prefer not to auto-load? Skip the loader and source this file directly,
# per shell:
#
#   . .satelle/operator.sh
#
# ------------------------------------------------------------------ verbs
#
#   waiting        what is sitting in signoff, waiting on you
#   story <id>     the story, then where it is and what its gates said
#   approve <id>   record your approval so the story can leave signoff
#

# approve <id> [note...]   record approval on an item in an operator state
#
# satelle will ask you to retype the item id. That retype is deliberate: it is
# one of the four things that stop a session forging your approval, along with
# the kernel refusing any call carrying SATELLE_SESSION, the edit-gate hook
# refusing the verb in an agent shell, and the record landing on the item's
# hash-chained ledger. This wrapper does not bypass it and must not.
approve() {
  local id=$1
  if [ -z "$id" ]; then
    echo "usage: approve <item-id> [note]" >&2
    return 2
  fi
  shift
  local note=${*:-approved}
  local f="${TMPDIR:-/tmp}/satelle-approval-$id.md"
  printf '%s\n\nrecorded by %s at %s\n' "$note" "${USER:-operator}" "$(date -u +%FT%TZ)" > "$f"
  satelle story record "$id" --file "$f"
}

# waiting   list the items sitting in this repo's operator state
waiting() {
  satelle story list --status signoff
}

# story <id>   the item, then where it is and what its gates said
story() {
  if [ -z "$1" ]; then
    echo "usage: story <item-id>" >&2
    return 2
  fi
  satelle story get "$1" && echo && satelle story route "$1"
}
