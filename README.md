Simple Speed Dial
==============

A speed dial functionally similar to the one used in Opera.

[Chrome Extension](https://chrome.google.com/webstore/detail/simple-speed-dial/gpdpldlbafdmhlmcdllcjgoigmpjonfc/details)
[GitHub Repository](https://github.com/j3nda/speed-dial-chrome)

### A note on latest additions.

I'll (oliverseal) be rebuilding this plugin from scratch soon. This was borrowed to have a basis to experiment with.
My preferred speed dial is that of Vivaldi's. After one too many crashes, a slow system, and borderline useless dev tools
in Vivaldi, I've returned to Chrome. This is a quick fix to get back to being productive.


Features
--------------
- Quick access to bookmark folders
- Add and delete bookmarks from the speed dial.
- Reorder bookmarks through drag and drop.


Description
--------------
I found the hardest part of transitioning to Chrome from Opera to be the lack of speed dial. After trying a number of options from the web store, I couldn't find anything that were as clean and simple as Opera. This speed dial is an attempt to fill that gap.

This implementation is more limited than Opera's. Opera generates thumbnail internally, meaning that it's not dependent on any external services .As far as I'm aware there is no provision to do the same in Chrome. The external service that was chosen to perform this role is free and unrestricted, but is only able to generate thumbnails for HTTP pages (no HTTPS). Advanced configuration options allow for this service to be changed if desired.


Release Notes
--------------
- 3.0.0: Switch to generating thumbnails based on visiting the bookmark.
- 2.5.0: Update of thumbnail generation service and other minor enhancements
- 2.4.6: Added vertical centering option
- 2.4.5: General code maintenance
- 2.4.4: Vertical centering bug, general enhancements
- 2.4.3: Resolved vertical centering bug
- 2.4.2: Performance improvements
- 2.4.1: Minor permission and style fixes
- 2.4.0: More comprehensive settings, shortcuts for opening dials, performance enhancements
- 2.3.0: Sync across computers, various speed and performance improvements
- 2.2.0: Custom icons for thumbs, performance improvements
- 2.1.1: Option to select a background colour
- 2.1.0: Drag and drop library changed. Number of minor code and interface improvements
- 2.0.0: Large-scale code rewrite. Bookmarks can now be edited
- 1.2.3: Miscellaneous tidy up
- 1.2.2: Fixed a bug with the show advanced checkbox
- 1.2.1: CSS fixes
- 1.2.0: Option implemented for default folder
- 1.1.1: Added a drop down for folder selection
- 1.1.0: Drag and drop implemented
- 1.0.1: Minor bugfixes and performance enhancements


Contributors
--------------
- Matt Ellis (waffleau)
- Jan Smid (J3nda)
- Asher Glick (AsherGlick)
- Eric (heavensrevenge)
- Oliver Garwil (oliverseal)
