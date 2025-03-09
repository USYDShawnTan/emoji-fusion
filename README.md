# Emoji Fusion

This project is a web application that allows users to combine two emojis into a larger emoji using a provided API. The application is built with React and styled using Tailwind CSS.

## Features

- Select two emojis from a picker.
- Display the combined emoji on a canvas.
- Show detailed information about the fusion result, including API responses.

## Project Structure

```
emoji-fusion
├── public
│   ├── favicon.svg
│   └── index.html
├── src
│   ├── components
│   │   ├── App.tsx
│   │   ├── EmojiCanvas.tsx
│   │   ├── EmojiPicker.tsx
│   │   └── FusionResult.tsx
│   ├── hooks
│   │   └── useEmojiApi.ts
│   ├── services
│   │   └── emojiApiService.ts
│   ├── types
│   │   └── index.ts
│   ├── styles
│   │   └── tailwind.css
│   ├── index.tsx
│   └── vite-env.d.ts
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd emoji-fusion
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

To start the development server, run:
```
npm run dev
```

Open your browser and go to `http://localhost:3000` to view the application.

## API

The application interacts with an emoji fusion API to combine the selected emojis. Ensure that the API is running and accessible.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes. 

## License

This project is licensed under the MIT License.