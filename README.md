# WerfLog

WerfLog is a tablet-oriented construction site tracking prototype built with
React, TypeScript, Vite, and Leaflet. Its Dutch interface supports project search,
map and list views of site items, status updates, category and status filters,
and backoffice summaries and charts.

The app originated from the Figma Make project
[Tablet Power Apps for Site Visits](https://www.figma.com/design/aJ4R6xrkbrGIzubaycfRhm/Tablet-Power-Apps-for-Site-Visits).

## Run locally

Use Node.js 24. From the project directory, run:

```sh
npm install
npm run dev
```

Open the local URL printed in the terminal, usually `http://localhost:5173`.
Keep the terminal running; press Ctrl+C to stop the server.

## Demo data

The original dummy records are restored in `src/infrastructure/seedData.ts`.
The project owner confirms that these records are fictional, including the sample
identities, contact details, addresses, incidents, and location associations.
They include realistic-looking names, emails, phone numbers, street addresses,
and coordinates for demonstrating the interface.

Demo map points are clustered around `(51.0543, 3.7174)`, which is also the fallback
map center for projects without items. The optional geolocation button uses the
browser user's location at runtime, with permission, rather than a demo fixture.

## Prototype behavior

Data is stored in memory for the current browser session. Status updates are
shared across views; refreshing the page restores the demo records.

The new-item dialog validates input and displays a success message but does not
create a record. Photo attachments and export are placeholders. There is no
backend, authentication, durable storage, or SharePoint integration.

## Development checks

```sh
npm test
npm run typecheck
npm run build
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for the layers, data flow, and extension points.

## License

Original project code is licensed under the [MIT License](LICENSE), copyright
2026 Omar Rahman. Third-party components and assets retain their respective
licenses and notices; see [ATTRIBUTIONS.md](ATTRIBUTIONS.md).

