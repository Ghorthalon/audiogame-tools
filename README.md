### WARNING! Very early development

# Audiogame Tools

This is a set of libraries written to aid in developing audiogames in the web browser.

Currently, this set includes:

* Asset management (loading big sound files, storing them locally in the browser cache or a directory, manifests to update sounds as they change)
* Entity Component System library: Entities are things in your game. Components are the data for Entities, and Systems iterate over specific entities with certain components to execute code. For example, a player entity would contain a position component (x, y, z), a health component (hp) and a velocity component (x, y, z). Then you could have a movement system which iterates over every single entity which has a movement and velocity component and update it accordingly.
* A simple event bus
* A completely rewritten input system which can take advantage of controllers, mouse, keyboard, and pointer lock
* Some commonly used math functions, based on [this library](https://github.com/matthiasferch/tsm) by [Matthias Ferch](https://github.com/matthiasferch)
* Extremely basic 3d physics
* A wrapper around WebAudio designed for games with static and streaming sources, and very easdy way to load a convolution reverb for different environments
* A scene manager to easily switch between different views or screens of your game and pass data between them
* A very basic scheduler
* TTS module
* UI module

## Status

This library is very much incomplete and still a work in progress. Documentation is more or less non existent, and I will be pushing examples in the following days. This will hopefully change as time progresses.
I'm working on this code and adding/improving things as my games need them. If you have anything you'd like to improve, fork the repository, make a change, and send a pull request. If you need help, simply open an issue, or use the discussion tab.

## Motivation

I've previously open sourced a bunch of modules to help make audiogames in the browser. I've decided to combine them all into one repository to make using them easier, as well as provide some way to bundle the whole engine into a single JavaScript file. Most of the previous libraries have been completely rewritten, or are in the process of being rewritten. Everything's written in Typescript.

These libraries are things I find myself reinventing over and over. There is a rough plan for things to add as I go. The main one is adding a basic 3d World component I can reuse across games, together with an editor, and basic features like an in-game radar, zone announcements, etc.
Together with the world editor, I would like to add a sound asset editor. The idea behind this is that you set up a sound asset which can have different properties, for example playing one out of a set of random sounds, pitch and volume randomization, etc. Then, in code, you would simply trigger the event, and the engine does all the work behind the scenes, such as selecting the right sound to play, randomizing the pitch and volume, setting its 3d Position, etc.

I'd like to state that these are things I work on in my limited free time and mainly for my own projects, however others might find use in them. If you'd like to help make them better, I'd highly appreciate it. Including this readme! 😉

## Using these libraries in your own project

Right now, I do not publish these libraries in their incomplete state to NPM. To use them, you can do the following:

* Clone this repository
* install the dependencies with yarn
* run the command: yarn compile:engine
* Switch into the dist directory
* run `yarn link` or `npm link`
* Switch to your project
* run: `yarn link audiogame-tools` or `npm link audiogame-tools`

This links the libraries from their development directory into your current project, and you can use them like you would any other npm module and build using webpack, esbuild, etc. 

You can also use `yarn bundle:engine` after building. This will produce an engine.js file which you can include in your project.

Again, if you have any questions, feel free to use the discussion tab on GitHub, or open an issue.
