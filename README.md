My aim was to make a simple but fun Tetris game, I used to play a lot of arcade and DOS games when I was younger :slot_machine: :joystick:

This Tetris game is based on https://github.com/meth-meth-method/tetris which is very well explained on Youtube but it was published in 2016, and without pseudocode so I added my own extensive pseudocode and since then Event Listeners that have keydown as a parameter for users to press on specific key codes, (example 81 is Key Q on the keyboard) the `event.keyCode` method has been deprecated which I found out about on this MDN article https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode

I found that using `event.key === 'ArrowDown'` set stricly equal to the key required in DOMString quotes resolves this issue! This MDN article is very helpful, https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key as it has a section where you can press on any key
and see what to reference in keydown Event Listeners.

I've also learnt some new ways to add sound effects to make it more interactive for the user, which I have achieved by putting sound effects inside audio tags in the html, accessing them with `querySelector()` in the Javascript and running these sound effects inside the functions where I want the sound to be heard with `.play()`

I'm working on issues to make this Tetris game mobile responsive and make to get the pause button functionality working so that the user can pause the game

https://millipede-cpu.github.io/tetris/
