# OceanuoTranslate

OceanuoTranslate is a modern, AI-powered translation application built with Next.js. It offers seamless multilingual communication using cutting-edge language models.

## Features

- Support for multiple translation services (OpenAI, Groq, DeepL)
- Automatic language detection
- Customizable AI model settings
- Dark mode support
- Responsive design for both desktop and mobile
- Copy and clear functionality for translated text

## Getting Started

### Prerequisites

- Node.js (version 14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/oceanuotranslate.git
   cd oceanuotranslate
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory and add your API keys:
   ```
   NEXT_PUBLIC_DEEPL_API_URL=your_deepl_api_url
   ```

4. Run the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

1. Select your source and target languages from the dropdown menus.
2. Enter the text you want to translate in the left text area.
3. Click the "Translate" button to get your translation.
4. Use the copy and clear buttons to manage your translated text.

## Customization

You can customize various settings in the Settings page, including:

- Theme (light, dark, or system)
- Translation service provider
- API key and host
- AI model and its parameters

## Built With

- [Next.js](https://nextjs.org/) - The React framework for production
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- OpenAI, Groq, and DeepL for their translation APIs
- The Next.js team for their excellent framework and documentation
