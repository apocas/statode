statode
==================

Email controlled, Node.js and LevelDB based status page.
Just send emails to post events in the status.

* Rename config.json.example to config.json.
* Setup all variables in config.json.
* Send an email to the specified email with a subject in following format: message->service->status[->timestamp]
** split is "->" if you leave it by default in the config.json
** timestamp to be used for this event (epoch time format in milliseconds) and its optional, if not specified email timestamp is used.
** status can be ISSUE, DOWN or UP. After an ISSUE or DOWN there must be an UP. The time passed between both events is used to calculate uptime.

Frontend based on https://github.com/balanced/status.balancedpayments.com
