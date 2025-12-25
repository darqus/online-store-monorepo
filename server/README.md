# Online Store Server

A minimal Express + Sequelize server for the online store backend.

## Features

- Express server with ES Modules
- Sequelize ORM (PostgreSQL by default)
- Environment-based configuration (`.env`)
- Graceful startup only after successful DB connection

## Prerequisites

- Node.js 18+
- PostgreSQL 13+ (local or remote)

## Project structure

```text
server/
├─ index.js           # App entry; waits for DB then starts server
├─ db.js              # Sequelize setup; supports DATABASE_URL or discrete vars
├─ .env               # Local environment variables (not committed)
├─ .env.example       # Template for required env variables
├─ package.json       # Scripts and dependencies
└─ README.md          # This file
```

## Environment variables

You can either provide a single `DATABASE_URL` or the discrete variables below.

```properties
# Server
PORT=5000

# Database (PostgreSQL)
# DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/DBNAME
DB_DIALECT=postgres
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=online_store
DB_USER=postgres
DB_PASSWORD=root
# DB_SSL=true   # enable for cloud providers that require SSL
```

Copy `.env.example` to `.env` and adjust values:

```bash
cp .env.example .env
```

## Local database setup

Using a local Postgres installation:

1. Create or set a password for your role and database

   ```sql
   -- in psql as superuser (e.g., `sudo -u postgres psql`)
   ALTER USER postgres WITH PASSWORD 'YourStrongPassword';
   CREATE DATABASE online_store OWNER postgres;
   ```

1. Test the connection

   ```bash
   psql -U postgres -h 127.0.0.1 -d online_store -c 'SELECT 1;'
   ```

1. Update `.env` accordingly.

## Install and run

```bash
# from the server/ folder
npm install
npm start
```

You should see logs:

- `✅ DB connection established`
- `🚀 Server listening on http://0.0.0.0:5000`

## Troubleshooting

- Authentication failed for user "postgres"
  - Ensure the password matches your role. Try logging in with psql:

    ```bash
    psql -U postgres -h 127.0.0.1 -d online_store -c 'SELECT 1;'
    ```

  - Update `.env` with the correct `DB_PASSWORD`.

- ECONNREFUSED / cannot reach DB
  - Verify Postgres is running and reachable on `DB_HOST:DB_PORT`.
- SSL errors on cloud DBs
  - Set `DB_SSL=true` in `.env`.

## Optional: Docker (quick start)

If you prefer Docker for Postgres, create a `docker-compose.yml` like below and run it.

```yaml
version: '3.8'
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: store_user
      POSTGRES_PASSWORD: store_pass
      POSTGRES_DB: online_store
    ports:
      - '5432:5432'
    volumes:
      - db_data:/var/lib/postgresql/data
volumes:
  db_data:
```

Set `.env` to:

```properties
DB_USER=store_user
DB_PASSWORD=store_pass
DB_NAME=online_store
DB_HOST=127.0.0.1
DB_PORT=5432
```

## Scripts

- `npm start` – start the server
- `npm run dev` – start with nodemon (auto-restart on changes)

You can enable linting locally by installing ESLint (optional):

```bash
npm i -D eslint
npx eslint .
```

## Database Models and Relationships

The server uses Sequelize to define and manage database models. The models are defined in `models/models.js`.

### Models

- **User**: Represents a user of the application.
- **Basket**: Represents a user's shopping basket.
- **BasketDevice**: A through table for the many-to-many relationship between baskets and devices.
- **Device**: Represents a product in the store.
- **Type**: Represents a type of device (e.g., "smartphone", "laptop").
- **Brand**: Represents a brand of device (e.g., "Apple", "Samsung").
- **Rating**: Represents a user's rating for a device.
- **DeviceInfo**: Represents additional information about a device.

### Relationships

- **User** and **Basket**: A user has one basket, and a basket belongs to one user (One-to-One).
- **User** and **Rating**: A user can have many ratings, and a rating belongs to one user (One-to-Many).
- **Basket** and **BasketDevice**: A basket can contain many devices, and a device can be in many baskets. This is a many-to-many relationship implemented through the `BasketDevice` model.
- **Type** and **Device**: A type can have many devices, and a device belongs to one type (One-to-Many).
- **Brand** and **Device**: A brand can have many devices, and a device belongs to one brand (One-to-Many).
- **Device** and **Rating**: A device can have many ratings, and a rating belongs to one device (One-to-Many).
- **Device** and **DeviceInfo**: A device can have many additional information entries (One-to-Many).

```mermaid
graph TD
    User -- "One-to-One" --> Basket
    User -- "One-to-Many" --> Rating
    Basket -- "Many-to-Many" --> Device
    Type -- "One-to-Many" --> Device
    Brand -- "One-to-Many" --> Device
    Device -- "One-to-Many" --> Rating
    Device -- "One-to-Many" --> DeviceInfo
```

## License

ISC
