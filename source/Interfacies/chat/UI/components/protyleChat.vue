<template>
    <div class=" fn__flex-column">
        <div>派蒙正在与你就这篇文档对话</div>
        <div ref="Container"></div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { sac, clientApi, kernelApi } from 'runtime';
console.log(clientApi)
console.log(clientApi.Protyle)
let blockId = "20230808120348-hynr7og"

const Container = ref(null)
onMounted(
    () => {
        kernelApi.sql({
            stmt: `select * from blocks where id="${blockId}"`
        }).then(
            data => {
                if (data[0].type !== 'd') {
                    console.error('目前只能就文档块展开对话')
                }
                let protyleEditor = new clientApi.Protyle(
                    sac.app, Container.value, {
                    blockId: blockId,
                    render: {
                        title: true,
                        background: true,
                        scroll: true,
                        gutter: true,
                    },
                }
                )
                console.log(protyleEditor, protyleEditor.protyle.element)

            }

        )


    }
)

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
