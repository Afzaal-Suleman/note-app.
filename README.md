# 📝 Notes Management Application

A complete, production-quality Notes Management application built with Node.js, Express, EJS, and vanilla JavaScript. Features server-side rendering, MVC architecture, and persistent data storage using JSON files.

## 🚀 Features

- **Full CRUD Operations** - Create, Read, Update, and Delete notes
- **Dashboard** - View statistics (total notes, favorites, pinned, categories)
- **Search** - Search notes by title, content, category, or tags
- **Filtering** - Filter notes by category
- **Sorting** - Sort by newest, oldest, A-Z, Z-A, favorites, or pinned
- **Favorites** - Mark notes as favorites for quick access
- **Pin Notes** - Pin important notes to appear first
- **Categories** - Organize notes with predefined categories
- **Tags** - Add custom tags to notes for better organization
- **Validation** - Form validation with error messages
- **Dark Mode** - Toggle between light and dark themes
- **Responsive Design** - Mobile-friendly interface
- **Glassmorphism UI** - Modern, clean design with glass effects
- **Toast Notifications** - Feedback for user actions
- **Error Pages** - Custom 404 and 500 error pages

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **EJS** - Templating engine for server-side rendering
- **HTML5** - Markup
- **CSS3** - Styling with glassmorphism effects
- **Vanilla JavaScript** - Client-side interactions
- **Node.js fs module** - File system operations for data persistence

## 📋 Requirements

- Node.js (v14 or higher)
- npm (comes with Node.js)

## 📦 Installation

1. **Clone or download the project**

2. **Navigate to the project directory**
   ```bash
   cd notes-app
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the application**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to: `http://localhost:3000`

## 📁 Project Structure

```
notes-app/
├── controllers/
│   └── noteController.js       # Business logic and helper functions
├── routes/
│   └── noteRoutes.js           # Express routes
├── data/
│   └── notes.json              # Database (JSON file storage)
├── public/
│   ├── css/
│   │   └── style.css           # Styles with glassmorphism UI
│   ├── js/
│   │   └── app.js              # Client-side JavaScript
│   └── images/                 # Image assets
├── views/
│   ├── partials/
│   │   ├── header.ejs          # HTML header
│   │   ├── footer.ejs          # HTML footer
│   │   └── navbar.ejs         # Navigation bar
│   ├── index.ejs               # Dashboard page
│   ├── create.ejs              # Create note form
│   ├── edit.ejs                # Edit note form
│   ├── view.ejs                # View single note
│   ├── 404.ejs                 # 404 error page
│   └── 500.ejs                 # 500 error page
├── server.js                   # Express server setup
├── package.json                # Project dependencies
└── README.md                   # This file
```

## 🎯 MVC Architecture

The application follows the Model-View-Controller (MVC) pattern:

### Model
- **Data Storage**: `data/notes.json` serves as the database
- **Data Structure**: Each note contains id, title, content, category, tags, favorite, pinned, createdAt, updatedAt

### View
- **EJS Templates**: Located in `views/` directory
- **Partials**: Reusable components (header, footer, navbar)
- **Server-Side Rendering**: All HTML is rendered on the server

### Controller
- **Business Logic**: `controllers/noteController.js`
- **Helper Functions**: Read/write operations, validation, filtering, sorting
- **Request Handling**: Processes user requests and returns responses

### Routes
- **URL Mapping**: `routes/noteRoutes.js`
- **Route Definitions**: Maps URLs to controller methods

## 🔄 CRUD Operations

### Create Note
- **Route**: `GET /notes/create` - Show create form
- **Route**: `POST /notes` - Save new note
- **Fields**: Title, Content, Category, Tags, Favorite, Pinned
- **Validation**: Title required (max 150 chars), Content required

### Read Notes
- **Route**: `GET /` - Display all notes (dashboard)
- **Route**: `GET /notes/:id` - View single note
- **Features**: Search, filter by category, sort options

### Update Note
- **Route**: `GET /notes/:id/edit` - Show edit form
- **Route**: `POST /notes/:id/update` - Save changes
- **Features**: Pre-filled form, validation

### Delete Note
- **Route**: `POST /notes/:id/delete` - Delete note
- **Features**: Confirmation dialog before deletion

### Additional Operations
- **Toggle Favorite**: `POST /notes/:id/favorite`
- **Toggle Pin**: `POST /notes/:id/pin`

## 💾 How notes.json Works

The application uses `data/notes.json` as a simple file-based database:

### Data Structure
```json
[
  {
    "id": 1,
    "title": "Node.js File System",
    "content": "fs.readFileSync() reads a file synchronously.",
    "category": "Node.js",
    "tags": ["node", "fs", "file-system"],
    "favorite": true,
    "pinned": false,
    "createdAt": "2026-07-10",
    "updatedAt": "2026-07-10"
  }
]
```

### File Operations
- **Read**: `fs.readFileSync()` - Reads all notes from JSON file
- **Write**: `fs.writeFileSync()` - Saves notes back to JSON file
- **Error Handling**: Try-catch blocks handle file read/write errors

### Helper Functions
- `readNotes()` - Reads and parses notes.json
- `writeNotes(notes)` - Writes notes array to notes.json
- `findNote(id)` - Finds a note by ID
- `generateId()` - Generates unique ID for new notes

### Data Persistence
- All notes are stored in `data/notes.json`
- Data persists between server restarts
- No external database required
- Easy to backup (just copy the JSON file)

## 🎨 UI Features

### Glassmorphism Design
- Frosted glass effect with backdrop blur
- Semi-transparent backgrounds
- Soft shadows and borders
- Modern, clean aesthetic

### Responsive Design
- Mobile-friendly layout
- Adaptive grid system
- Touch-friendly buttons
- Optimized for all screen sizes

### Dark Mode
- Toggle between light and dark themes
- Persists user preference in localStorage
- Smooth transitions between themes

### Animations
- Hover effects on cards
- Button ripple effects
- Smooth page transitions
- Loading states for forms

### Toast Notifications
- Success messages after create/update/delete
- Auto-dismiss after 5 seconds
- Color-coded by message type

## 🔍 Search & Filter

### Search
- Search by title, content, category, or tags
- Server-side filtering using query parameters
- Example: `/?search=node`

### Category Filter
- Filter notes by category
- Dropdown selection
- Example: `/?category=Node.js`

### Sorting Options
- **Newest** - Most recently created first
- **Oldest** - Oldest created first
- **A-Z** - Alphabetical by title
- **Z-A** - Reverse alphabetical
- **Favorites** - Favorite notes first
- **Pinned** - Pinned notes first

### Combined Filters
- Search, category, and sort can be combined
- Example: `/?search=node&category=Node.js&sort=newest`

## ✅ Validation

### Title Validation
- Required field
- Maximum 150 characters
- Real-time character counter
- Visual feedback on errors

### Content Validation
- Required field
- No character limit
- Multi-line support

### Error Handling
- Server-side validation
- Error messages displayed on form
- Form data preserved on validation errors

## 🎯 Categories

Predefined categories:
- Programming
- Node.js
- Express
- JavaScript
- Laravel
- React
- English
- Personal
- Interview

## ⌨️ Keyboard Shortcuts

- **Ctrl/Cmd + K** - Focus search input
- **Escape** - Close modals (future enhancement)

## 🐛 Error Handling

### 404 Page
- Custom 404 error page
- Friendly error message
- Link back to dashboard

### 500 Page
- Custom 500 error page
- Error details displayed
- Link back to dashboard

### Server Errors
- Try-catch blocks in all controllers
- Error logging to console
- Graceful error recovery

## 🔧 Development

### Adding New Features
1. Add route in `routes/noteRoutes.js`
2. Add controller method in `controllers/noteController.js`
3. Create/update EJS view in `views/`
4. Add styles in `public/css/style.css` (if needed)
5. Add JavaScript in `public/js/app.js` (if needed)

### Modifying Data Model
- Update note structure in controller
- Modify validation rules
- Update EJS forms to include new fields
- Update notes.json manually for existing data

### Customizing UI
- Modify CSS variables in `public/css/style.css`
- Update color schemes
- Adjust glassmorphism effects
- Change animations

## 📝 Notes

- No REST API - All actions use traditional form submissions
- No external database - Uses JSON file storage
- No client-side frameworks - Pure vanilla JavaScript
- Server-side rendering with EJS
- All data persists in `data/notes.json`

## 🤝 Contributing

This is a beginner-friendly project. Feel free to:
- Add new features
- Improve the UI
- Fix bugs
- Add more validation
- Enhance error handling

## 📄 License

ISC

## 👨‍💻 Author

Created as a complete, production-quality notes management application demonstrating MVC architecture with Node.js, Express, and EJS.

---

**Enjoy using the Notes App! 📝✨**
