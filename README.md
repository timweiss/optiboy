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
Send a `POST` request to `/` with the following JSON body:
```json
{
  "email": "youremail@example.com"
}
```
This email will receive an email with the prompt to validate the subscription.

### Admin endpoints
In order to enable the admin routes, `APP_ADMIN_ENABLE` must be set to `true` in the environment. `APP_ADMIN_SECRET` also needs to be set.
All requests to the admin endpoints need the `Authorization` header to be set to `Bearer <APP_ADMIN_SECRET>`, replace `<APP_ADMIN_SECRET>` with your own secret.

#### Fetching all confirmed email addresses
Send a `GET` request to `/admin`, the API with a JSON array of the following structure:
```json
[
  {
    "email": "youremail@example.com",
    "source": "https://example.com",
    "createdAt": "2023-01-01T00:00:00.000Z"
  }
]
```

#### Checking if an email address is confirmed
Send a `GET` request to `/admin/youremail@example.com` to check if the email address is confirmed. If it does not exist or is not confirmed, a `404` is returned. Otherwise, a `200` is returned with the following JSON body:
```json
{
  "email": "youremail@example.com",
  "source": "https://example.com",
  "createdAt": "2023-01-01T00:00:00.000Z"
}
```

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

## Customizing the confirmation mail
You can provide a custom template for the confirmation mail. [The template](src/templates/confirm-email.mjml) is written with [MJML](https://mjml.io/) and templated using [Nunjucks](https://mozilla.github.io/nunjucks/).
If you want to replace the template running within Docker, be sure to mount it by customizing the [`docker-compose`](docker-compose.yml) file. Currently, only the `confirmationUrl` is injected into the template.

```yaml
# ...
      app:
        # ...
        volumes:
        - ./src/templates/confirm-email.mjml:/home/node/app/src/templates/confirm-email.mjml
```