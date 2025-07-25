# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**mediathek-cli** is a Node.js CLI tool for querying German public broadcasting media databases (OER). It interfaces with the [MediathekViewWeb](https://mediathekviewweb.de/api/query) API to search, view details, and download content from German TV stations like ARD, ZDF, SRF, etc.

## Development Commands

### Essential Commands
```bash
# Build TypeScript to dist/
npm run build

# Lint code (ESLint v9 with oclif config)
npm run lint

# Run tests
npm run test

# Test CLI locally with sample query
npm run local

# Development workflow: build and test a query
npm run build && ./bin/run query tagesschau -l 3
```

### CLI Usage Examples
```bash
# Basic search
./bin/run query "tagesschau"

# Advanced search with filters
./bin/run query tagesschau -c ARD -t "20:00 Uhr" --dmin 10

# View detailed information (requires previous query)
./bin/run detail 0

# Download media file (requires previous query)
./bin/run download 0
```

## Architecture Overview

### Core Framework
- **oclif v4.5.2**: CLI framework (recently migrated from v1)
- **TypeScript 5.8.3**: Primary language
- **Node.js 18+**: Runtime requirement

### High-Level Data Flow

1. **Command Parsing** (`src/commands/`) → **API Request** (`src/modules/request.ts`) → **Cache Storage** (`src/modules/fs.ts`) → **Display Output** (`src/modules/cli_output.ts`)

2. **State Management**: The CLI uses a JSON cache file (`~/.cache/media/.mediathek_cli.json`) to store search results and enable cross-command references (e.g., `detail 0` refers to first result from last `query`)

### Module Responsibilities

**`src/commands/`** - oclif command implementations
- `query.ts`: Main search command with extensive filtering options
- `detail.ts`: Shows detailed info for a specific result ID  
- `download.ts`: Downloads media files with user prompts for file location

**`src/modules/request.ts`** - External API communication
- `queryApi()`: POST requests to MediathekViewWeb API
- `downloadFile()`: HTTPS file downloads with progress indicators
- API endpoint: `https://mediathekviewweb.de/api/query`

**`src/modules/fs.ts`** - Local cache management
- `save_history()`: Persists search results with local IDs for command chaining
- `load_history()`: Retrieves cached results by local ID
- Cache location: `{cacheDir}/.mediathek_cli.json`

**`src/modules/cli_output.ts`** - User interface formatting
- `draw_table()`: Displays search results in tabular format using cli-table3
- `showDetail()`: Formats detailed view with metadata and URLs
- Uses chalk v5 for terminal styling

### Key Data Structures

**Query Object** (sent to API):
```typescript
{
  queries: Array<{fields: string[], query: string}>,
  sortBy: 'timestamp' | 'duration',
  sortOrder: 'desc' | 'asc',
  future: boolean,
  offset: number,
  size: number,
  duration_min: number,
  duration_max: number
}
```

**API Response Structure**:
```typescript
{
  result: {
    results: MediaEntry[],
    queryInfo: {
      totalResults: number,
      searchEngineTime: string
    }
  }
}
```

### Recent Migration Notes

This codebase was recently upgraded from a 3-year-old state:
- **oclif v1 → v4**: Major breaking changes handled (Args API, CliUx → ux, table functionality)
- **Dependencies**: All updated to latest versions (chalk v5 ESM, inquirer v9, axios v1.11, etc.)
- **TypeScript**: Updated to v5.8.3 with modern config
- **ESLint**: Migrated to v9 with new flat config format

### Current Technical Debt

- **Code Quality**: 1,300+ ESLint violations (mostly stylistic)
- **TypeScript**: Extensive use of `any` types instead of proper interfaces
- **Architecture**: Mixed concerns, synchronous file operations, Promise anti-patterns
- **Error Handling**: Limited user-friendly error messages

## Configuration Files

- **tsconfig.json**: Modern TypeScript configuration targeting ES2022
- **eslint.config.js**: ESLint v9 flat config using oclif presets
- **package.json**: oclif configuration in `"oclif"` section, Node.js 18+ requirement

## Testing

- Framework: Mocha + Chai
- Test location: `test/` directory
- Current state: Basic test structure exists but needs expansion
- oclif provides `@oclif/test` utilities for CLI testing

## CLI Entry Point

- Binary: `./bin/run` 
- Compiled output: `dist/` directory
- oclif handles command discovery and routing automatically