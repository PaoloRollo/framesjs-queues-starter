# 🖼️ FramesJS + Queues Starter

This is a boilerplate repo forked from [framesjs](https://github.com/framesjs/frames.js) example to get you started developing frames that use [QStash](https://upstash.com/docs/qstash) queues to handle multiple concurrent requests at once from the same users to avoid bots, spamming, or w/e.

## 🏡 Getting started

To start things out, you need an [upstash](https://upstash.com). Once created, you need to setup QStash and retrieve the following environment variables from your dashboard:

```bash
QSTASH_NEXT_SIGNING_KEY=
QSTASH_CURRENT_SIGNING_KEY=
QSTASH_TOKEN=
```

You can use the `.env.sample` to see other environment variables you might need to set.

Once you've got all your environment variables set up, you can clone this repo by running this command:

```bash
git clone https://github.com/PaoloRollo/framesjs-queues-started.git framesjs-queues-starter
cd framesjs-queues-starter
```

Then, install the dependencies and run the server:

```bash
yarn install
yarn dev
```

You should be able to visit [http://localhost:3000](http://localhost:3000) and see the example app running.

## ⁉️ How does it work?

You can find the main logic in two different files:

- `app/api/producers/example/route.ts` contains the code to handle a new message being inserted in the queue (this can be - for example - when a user clicks a mint button on the frame). It will produce a message that will be added to the QStash queue using **deduplication** based on the user address: this allows no more than one message to be added to the queue for the same user address in a given time frame. You can also enable **content-based deduplication** to avoid the same message being added to the queue multiple times;
- `app/api/queues/example/route.ts` contains the code to handle the message being consumed from the queue. In this endpoint, you can perform checks to whether the user can perform the action or not, and then perform the action itself in case the checks are successful.

**NOTE**: the deduplication logic denies multiple messages (from the same user) from existing in the queue at the same time, but does not prevent the same user to later add another message once the previous one has been consumed. This means that you **need to handle yourself** the case in which a user tries to perform an action that is already being processed.

## 🛠️ Test the app

In order to test the workflow the app must be deployed on [Vercel](https://vercel.com), since QStash requires a public endpoint to send the messages to. Once deployed, you can use the `curl` command to send a message to the queue:

```bash
curl -X POST -H "Content-Type: application/json" https://your-app.vercel.app/api/producers/example
```

You should be able to see in the logs that the message has been added to the queue, and then consumed by the queue.

You can use various tools to send multiple requests to the queue (like `ab`) and see how the deduplication logic works.

## 📚 Docs and help

- [Frames.js Documentation](https://framesjs.org)
- [Awesome frames](https://github.com/davidfurlong/awesome-frames?tab=readme-ov-file)
- Join the [/frames-dev](https://warpcast.com/~/channel/frames-devs) channel on Farcaster to ask questions
