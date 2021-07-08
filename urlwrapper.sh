#!/bin/bash
SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

kdocker -i ${SCRIPTPATH}/f5logo.svg -l -t -m -- gnome-terminal -x sh -c "sudo pypy ${SCRIPTPATH}/f5vpn-login.py \"$1\" || read " &
