#!/bin/bash
SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

gnome-terminal -x sh -c "sudo ${SCRIPTPATH}/f5vpn-login.py \"$1\" "