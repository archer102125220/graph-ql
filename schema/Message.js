export class Message {
  constructor(id, { content, author }) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
}

export const MessageSchemaTypeName = 'Message';
export const MessageSchema = `
  type ${MessageSchemaTypeName} {
    id: ID!
    content: String
    author: String
  }`;

export const MessageInputSchemaName = 'MessageInput';
export const MessageInputSchema = `
  input MessageInput {
    content: String
    author: String
  }`;

export default Message;