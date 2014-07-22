statode
==================

Email controlled, Node.js and LevelDB based status page.

Just send emails to post events in the status page. As simple as that.

## Usage

* git clone https://github.com/apocas/statode
* npm install
* Rename config.json.example to config.json.
* Setup all variables in config.json.
* node main
* Send an email to the specified email with a subject in following format: message->service->status[->timestamp]
    * split is "->" if you leave it by default in the config.json
    * timestamp to be used for this event (epoch time format in milliseconds) and its optional, if not specified email timestamp is used.
    * status can be ISSUE, DOWN or UP. After an ISSUE or DOWN there must be an UP. Only time passed between DOWN and UP events is used to calculate the uptime.

## Important

Statode's frontend was based on https://github.com/balanced/status.balancedpayments.com
