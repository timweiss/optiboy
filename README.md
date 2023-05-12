# optiboy
Collect email addresses on your own server, complete with double opt-in.

## Motivation
The most convenient way to collect emails for a newsletter, blog, etc. is via a lot of third-party services.
Most of them reside in countries with potentially unsafe transfers. Still, a double opt-in is required to be able to send emails.

## Capabilities
* Collect email addresses via one endpoint
* Opt-in mail is sent to email
* Simple confirmation page

## Requirements
* Docker (Compose) on machine
* Any SMTP server or service

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
```

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