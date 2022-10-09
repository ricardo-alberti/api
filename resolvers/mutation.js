module.exports = {
  deleteNote: async (parent, { id }, { models }) => {
    try {
      await models.Note.findOneAndRemove({ _id: id});
      return true;
    } catch (err) {
      return false;
    }
  },
  newNote: async (parent, args, { models}) => {
    return await models.Note.create({
      content: args.content,
      author: 'Adam Scott'
    });
  }
}
