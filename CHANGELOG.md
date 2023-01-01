# Change Log

All notable changes to the "class-docstring-gen" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

- Initial release

## [1.0.0] - 2022-12-15

### Added

- Functions args and kwargs are updated so that new args are below the last arg and new kwargs are below the last kwarg
- New gifs and readme in Gitlab

### Planned Updates

- Smart logic for updating where new items are added in the correct order
- Add decorators to docstring
- Logic where newly generated class docstring should grab the summary from methods if available
- More code cleanup (especially in update_docstring)