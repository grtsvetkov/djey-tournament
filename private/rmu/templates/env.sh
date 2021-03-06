#!/bin/bash
export PORT=80
export MONGO_URL=mongodb://127.0.0.1/<%= appName %>
export ROOT_URL=http://<%= appName %>

#it is possible to override above env-vars from the user-provided values
<% for(var key in env) { %>
  export <%- key %>=<%- ("" + env[key]).replace(/./ig, '\\$&') %>
<% } %>

/usr/bin/node /opt/<%= appName %>/app/main.js production &