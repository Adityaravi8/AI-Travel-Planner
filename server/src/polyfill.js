const nodeVersion = parseInt(process.versions.node.split(".")[0], 10);

if (nodeVersion < 18) {
  console.warn(
    `Warning: Node.js ${process.versions.node} detected. ` +
      `This application requires Node.js 18 or higher for native fetch and Web Streams support.`
  );
}

export {};
