# CINotify API

## Demo

```
curl --request POST 'http://localhost:8787/api/notify' \
  -d "to=api-readme@jesse.sh&subject=hello&body=see attached&attachments[][type]=text/plain&attachments[][content]=aGVsbG8sIHdvcmxkIQ==&attachments[][filename]=hello.txt"
```

## Local Development

```
npm run dev
npm test
```
