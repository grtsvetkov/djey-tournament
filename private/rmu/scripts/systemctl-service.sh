#!/bin/bash

systemctl daemon-reload
systemctl enable <%= appName %>
