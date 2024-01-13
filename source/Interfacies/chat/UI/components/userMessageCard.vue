<template>
    <div class="user-message user-message-card fn__flex">
        <div class="fn__flex-column">
            <div class="user-message-header fn__flex">
                <img class="user-avatar" :src="user.avatar" alt="User's avatar">
                <h3 class="user-name">{{ user.name }}</h3>
                <span class="message-timestamp">{{ message.timestamp | formatDate }}</span>
                <div class="fn__space fn__flex-1"></div>
                <span class="user-message-actions fn__flex fn__flex-inline">
                    <span class="b3-tooltips b3-tooltips__nw block__icon block__icon--show"
                        @click="replyToMessage(message.id)" aria-label="Reply to message">
                        <svg>
                            <use xlink:href="#iconCopy"></use>
                        </svg>
                    </span>
                    <span class="b3-tooltips b3-tooltips__nw block__icon block__icon--show" @click="editMessage(message.id)"
                        aria-label="Edit message">
                        <svg>
                            <use xlink:href="#iconEdit"></use>
                        </svg>
                    </span>
                    <span class="b3-tooltips b3-tooltips__nw block__icon block__icon--show"
                        @click="deleteMessage(message.id)" aria-label="Delete message">
                        <svg>
                            <use xlink:href="#iconTrashcan"></use>
                        </svg> </span>
                </span>
            </div>
            <div class="user-message-content" v-if="!isEditing">
                <p>{{ message.content }}</p>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { sac, clientApi } from 'runtime';


const user = ref({
    name: 'Jane Doe',
    avatar: 'path-to-avatar.jpg'
});
const isEditing = ref(false);
const editableContent = ref('');

const message = ref({
    id: 'msg-123',
    content: 'This is a mock message content.',
    timestamp: new Date().toISOString() // ISO string of the current date and time
});
const editMessage = (messageId) => {
    isEditing.value = true;
    editableContent.value = message.value.content; // Copy the current message content to the editable field
};



// Mock functions for actions
const replyToMessage = (messageId) => {
    // Implement the reply functionality here
    console.log(`Reply to message with ID: ${messageId}`);
};



const deleteMessage = (messageId) => {
    // Implement the delete functionality here
    console.log(`Delete message with ID: ${messageId}`);
};

// A mock filter to format the date, you can replace it with a real one
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};
</script>
