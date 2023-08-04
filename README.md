# optiboy
Collect email addresses on your own server, complete with double opt-in.

## Motivation
The most convenient way to collect emails for a newsletter, blog, etc. is via a lot of third-party services.
Most of them reside in countries with potentially unsafe transfers. Still, a double opt-in is required to be able to send emails.

## Capabilities
* Collect email addresses via one endpoint
* Opt-in mail is sent to email
* Simple confirmation page
* Notification mail (optional)

## Requirements
* Docker (Compose) on machine
* Any SMTP server or service

## Usage
### Collecting email addresses
Send a POST request to `/` with the following JSON body:
```json
{
  "email": "youremail@example.com"
}
```

This email will receive an email with the prompt to validate the subscription.

## Deployment
1. Clone this repository
2. Configure your own environment variables in `.env`
3. Start with `docker compose up -d`

### Required environment variables
```
APP_EMAIL_SENDER=<your email address>
APP_EMAIL_SMTP_HOST=<SMTP host>
APP_EMAIL_SMTP_USER=<SMTP username>
APP_EMAIL_SMTP_PASSWORD=<SMTP password>
APP_HOSTNAME=<your hostname>
```

You'll need to set up a reverse proxy like nginx on your server. The following configuration is an example for nginx:
```
server {
	# replace example.com with your domain name
	server_name example.com;

	location / {
		proxy_pass http://127.0.0.1:3000;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
	}
}
```

### Updating
1. Pull the latest version
2. Run `docker compose up -d --build`

The migrations will automatically run to keep the database up to date.

## Development
You can run optiboy locally in your favorite IDE. To test the email sending, you need to procure your own SMTP service and configure the environment.
Please refer to [config.ts](src/util/config.ts) for the required environment variables.

### Building
```shell
npm run build
```

### Running
```shell
npm run start
```