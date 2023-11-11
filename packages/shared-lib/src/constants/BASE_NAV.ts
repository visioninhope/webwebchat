export const BASE_NAV = {
    RM_HASH: function (location: string) {
        return location.replace("#", "");
    },
    HOME: '#/',

    SETTINGS: '#/settings',

    CHAT: function (chatId: string) {
        return `#/chat/${chatId}`;
    },

    LLMS: '#/settings/llms',

}