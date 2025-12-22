import models from "../models/index.js";

export const getAllBooks = async () => {
    const result = await models.Book.findAll();
    return result;
}; 

export const getBookById = async (id) => {
    const result = await models.Book.findByPk(id);
    return result;
};


export const getBooksByUserId = async (userId) => {
    const result = await models.Book.findAll({
        where: {user_id: userId}
    });
    return result;
};

export const createBook = async (book) => {
    const { title, author, genre, rating, review, user_id } = book; 

        const result = await models.Book.create({
            title,
            author,
            genre,
            rating,
            review,
            user_id
        });
    return result;
}; 



export const updateBook = async (id, book) => {
    const { title, author, genre, rating, review } = book; 

    const result = await models.Book.update(
        {
            title,
            author,
            genre,
            rating,
            review,
            updated_at: new Date()
        },
        {
            where: { id },
            returning: true
        }
    );

    return result[1][0];
}; 


export const deleteBook = async (id) => {
    await models.Book.destroy({
        where: { id }
    });
};