const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Comment = require("./models/comment")

var seeds = [
    {
        name : "Middle of nowhere",
        image : "https://images.unsplash.com/photo-1533873984035-25970ab07461?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec condimentum viverra metus at rhoncus. Nam non ultricies dolor. Vestibulum eu elit eget arcu blandit laoreet. Integer congue viverra neque eget rhoncus. Duis consequat nulla id interdum varius. Vestibulum scelerisque in sapien non elementum. Curabitur blandit fringilla faucibus."
    },
    {
        name : "In the green",
        image : "https://images.unsplash.com/photo-1497900304864-273dfb3aae33?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec condimentum viverra metus at rhoncus. Nam non ultricies dolor. Vestibulum eu elit eget arcu blandit laoreet. Integer congue viverra neque eget rhoncus. Duis consequat nulla id interdum varius. Vestibulum scelerisque in sapien non elementum. Curabitur blandit fringilla faucibus."
    },
    {
        name : "Mobile Camp",
        image : "https://images.unsplash.com/photo-1528759335187-3b683174c86a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec condimentum viverra metus at rhoncus. Nam non ultricies dolor. Vestibulum eu elit eget arcu blandit laoreet. Integer congue viverra neque eget rhoncus. Duis consequat nulla id interdum varius. Vestibulum scelerisque in sapien non elementum. Curabitur blandit fringilla faucibus."
    }
];


//ES6 async await version of seedDB instead of having callback hell
async function seedDB(){
    //Remove all campgrounds & comments
    await Campground.remove({});
    console.log("campgrounds removed");
    await Comment.remove({});
    console.log("comments removed");

//     for(const seed of seeds) {
//         let campground = await Campground.create(seed);
//         console.log('Campground created');
//         let comment = await Comment.create(
//             {
//             text: "This palce is great, but I wish I had internet",
//             author: "Omer"
//             }    
//         )
//         console.log('comment created');
//         campground.comments.push(comment);
//         campground.save();
//         console.log('Comment added to campground');
//     }
}

module.exports = seedDB;