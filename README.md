Visual Studio Code extension to quickly generate and update docstring for python classes and functions.

Docstring generation based off of njpwerner's public autodocstring extension so docstring generation is very robust.

Docstring updating created in-house by Jacky.

For Demos, see the GitLab repository.

## Features

-	Quickly genereate/update a docstring snippet that can be tabbed through.
-	Infers function parameter and class attribute types.
-	Support for function args, kwargs, exceptions, and parameter types
-	Support for class parents/inheritence, attributes, attribute types, methods, and exceptions

## Usage

Cursor must be on the line directly below the function/class definition to generate the complete docstring
Cursor must be on the last line of the docstring where the ending quotes """ or ''' are to update the docstring

To force the commands to activate (not recommended), use ctrl+shift+p to show the command palette and look for 'Generate/Update Class/Function Docstring'

## Requirements

None

## Extension Settings

No public settings at the moment, but may change in the future.