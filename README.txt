CPSC 314 Project 4
Harry Potter and the Flight of Fire

By:
Shaylene Beaudry - 11601077 - i2b9
Angela Chen - 21226055 - e9z8

**NOTE** 
We both have 3 grace days left, and will be using all of them for this project.



What:
Harry Potter is trapped inside a donut-shaped room, which has caught on fire. His only way out is to catch the Snitch. 
Help Harry capture rings, which help him move closer to the Snitch. Watch out, they don't stay still very long!
Make sure to avoid the flames so he doesn't get hurt.
Harry can recover some of his health by drinking potions, but he needs you to pick them up for him!
Once Harry has captured enough rings, he can grab the Snitch and be free!
But if he runs out of time or health... he will never escape :(

Advanced Functionality:
- Particle Systems: 
	- provides a sparkle effect for the snitch
	- provides an exploding light effect to signify point lights
- Procedural Modeling/Motion: 
	- rings and fires are added at random positions within the confines of the room upon start of game
	- potions are periodically added to a random position on the floor of the room (within the confines of the walls)
	- the rings will move to new random positions at certain time intervals
- Collision Detection
	- Harry and Room - Harry cannot go through walls, ceiling, and floor of room
	- Harry and Rings - Ring disappears when Harry touches it, Harry advances closer to snitch
	- Harry and Fire - Fire disappears when Harry touches it, Harry loses one health point
	- Harry and Snitch - The user wins the game and they receive their final score
	- Collision detection between Harry and rings/fire/Snitch is done via intersecting Spheres ("force fields")



How:

Algorithm:
- Upon each rendering of the scene:
	- check if Harry is colliding with any object
		- If collided with a ring, Harry moves forward one position
		- If collided with fire, Harry loses one health point
		- If collided with snitch, the user wins the game
	- update the on-screen control panel
		- update time left
		- update current fps
	- animate the particle systems
	- check if the game has ended
		- If Harry is touching Snitch, game stops and winning score is computed and shown on the screen
		- If Harry has 0 health points or time has run out, game stops and "You lose" message shown on screen
		- Otherwise, continue
- At specified/varying time intervals
	- Move fire/rings to random location
	- Add potion to scene

Data structures:
- room - two cylinders for walls, two planes for floor/ceiling
- rings (TorusGeometry), fire and potions and centers (SphereGeometry), walls and orbit (CylinderGeometry)
	- multiple instances of these objects stored in arrays
	- functions will iterate through each array to perform behaviour on each object
- center#/center#cam - spheres that Harry/camera are parented to (respectively) 
	- Harry moves forward by becoming parented to centers closer to the Snitch
	- camera moves as Harry moves, is parented to corresponding center#cam



How To:

- Win the game by capturing the Snitch within the time limit, and before you run out of health
- Start the game by pressing Spacebar
- Move Harry up, down, left, right by pressing the w,s,a,d keys (respectively)
- Pause/unpause the game by pressing Spacebar
- Change the camera angle by clicking and dragging your mouse cursor; zoom in/out using the mouse scroll wheel

- Make Harry touch the rings in order to advance closer to the snitch
- Make Harry avoid the fire; if he touches them, he will lose health
- Use the mouse cursor to click on a potion in order to re-gain health

- After touching 5 rings, Harry will be able to catch the Snitch; make sure that he's touching it so that you can win the game!
- You will lose if you reach 0 health, and/or time goes down to 0. Watch the color of your control panel; it will change when you're getting closer to losing
- Restart the game by pressing Spacebar



Sources:

http://stemkoski.github.io/Three.js/Viewports-Minimap.html - creating a map of the scene
https://github.com/mrdoob/stats.js/ - calculating fps, adding HTML elements atop of scene
https://www.youtube.com/watch?v=M5yULz6OZSE - links to Harry Potter 3D models
https://stemkoski.github.io/Three.js/Particles.html - adapted particle systems from this example