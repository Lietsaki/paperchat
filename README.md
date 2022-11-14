<img src="https://user-images.githubusercontent.com/46164357/201747615-e661f761-f944-49a0-8535-cc82e408ab93.png" width="500px" />

# Paperchat - Intro

Paperchat is an online, real-time spiritual successor of Pictochat, an app that was included with the Nintendo DS released for the first time in 2004.

I created a fully responsive version from scratch using React (Next.js), without help from any external libraries to interact with the canvas. Please check it out on paperchat.net :)

## Component Highlights

The repository you see right now contains about 70% of the code needed to run your own instance. Specifically, what's included is the frontend logic and components. Here are my personal highlights:

- **Canvas.tsx:** The canvas itself. Crops your messages before sending them so they take as little space as possible. This gif illustrates it very well:

  <img src="https://user-images.githubusercontent.com/46164357/201764522-64a5dc2c-d657-41c8-8d2c-d5da8086ac9b.gif" width="250px" />

  As you can see, there are 4 possible variations:

  - Everything is next to the username rectangle.
  - The highest point of your drawing is next to the username rectangle.
  - The highest point of your drawing is below and under the username rectangle (to the left).
  - The highest point of your drawing is outside the username rectangle, but below it (to the right).

- **ContentIndicator.tsx:** The bars stacked on top of each other in the left side of the top screen.

  <img src="https://user-images.githubusercontent.com/46164357/201761041-226b2729-4ea7-4d87-87d4-6e81c43fb3b2.gif" width="250px" />

  They follow the messages that are currently shown on-screen thanks to an [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API). When it is overflown, the top or bottom of it becomes smaller to indicate in which direction there are more messages.

  <img src="https://user-images.githubusercontent.com/46164357/201765734-b51201d5-22bb-4396-975f-43ce8ee75564.gif" width="120px" />

## Creating my own instance

The backend pieces that allow creating rooms and sending messages were created with Firebase. I used these products to bring Paperchat into life:

- Realtime Database.
- Storage.
- Hosting.
- Functions (the `/functions` directory is in fact included here!)
- Authentication (anonymous)

The directory that contains the data related to such products is `/firebase-config` and it has only 3 files:

1. **init.ts:** Initializes the Firebase App.
2. **realtimeDB.ts:** Contains functions to interact with the realtime database.
3. **storage.ts:** Contains one function that uploads pictures to the app's Storage bucket.

By leaving out this directory from the repository I'm allowing you to create your own backend with the technology you prefer, say for example `Node.js + Socket.io`.

But if you wanted to use Firebase as well, I can provide you with the names of the variables exported from these files.

```
// init.ts
One default export that simply initializes the app.

// realtimeDB.ts
export {
USERS_LIMIT,
SIMULTANEOUS_ROOMS_LIMIT,
PRIVATE_CODE_LENGTH,
DAILY_ROOMS_LIMIT,
createRoom,
joinRoom,
sendMessageToRoom,
getRoomMessages,
searchForRooms,
requestJoinPrivateRoom,
leaveRoom,
getCurrentRoomData,
getCurrentUserID,
listenForDisconnectAndMessages,
updateRoomMessages
}

// storage.ts
export { uploadAndGetUrl }
```

## Bug reporting

Please feel free to open an issue if you think you've found a bug, provide least the following information:

- Description of the problem.
- Platform (desktop browser, mobile browser, android app)
- If related to styles breaking or similar, dimensions of the screen where this happens.
- A screenshot, if possible.

## Contributions

If you have expanded or improved the functionality of Paperchat, please feel free to submit a pull request explaining how your changes make the application better :)
