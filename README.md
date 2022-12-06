## Features

Creates a doc string for class to show the class attributes

Example:

Class MyClass(object):

    __init__(self):
        self.attr = 1

The generated docstring would be:

Class MyClass(object):
    """ Desc:
    Attributes:
    attr:
    """

## Requirements

None

## Extension Settings

No extensions at the moment, but may change in the future

## Release Notes

Currently in development