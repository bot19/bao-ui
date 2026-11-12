# satelle operator loader — copy to ~/.satelle/approve.sh, source from ~/.zshrc:
#
#   [ -f "$HOME/.satelle/approve.sh" ] && . "$HOME/.satelle/approve.sh"
#
# It holds no verbs of its own. It finds the operator verbs in whichever repo
# you are standing in — <repo>/.satelle/operator.sh — and sources them, on
# every cd. So the verbs travel with the repo, can differ between repos, and a
# fresh clone needs no setup beyond this one line.
#
# It runs a file out of the repo you cd into. cd only into repos you trust.

_satelle_operator_load() {
  local root file
  root=$(git rev-parse --show-toplevel 2>/dev/null) || return 0
  file="$root/.satelle/operator.sh"
  [ -r "$file" ] && . "$file"
  return 0
}

if [ -n "${ZSH_VERSION:-}" ]; then
  autoload -Uz add-zsh-hook && add-zsh-hook chpwd _satelle_operator_load
elif [ -n "${BASH_VERSION:-}" ]; then
  # bash has no chpwd hook; re-check before each prompt instead.
  case "${PROMPT_COMMAND:-}" in
    *_satelle_operator_load*) ;;
    *) PROMPT_COMMAND="_satelle_operator_load${PROMPT_COMMAND:+; $PROMPT_COMMAND}" ;;
  esac
fi

_satelle_operator_load
