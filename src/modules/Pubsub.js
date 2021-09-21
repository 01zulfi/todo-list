const pubsub = {
    events: {},
    publish: function(eventName, data) {
        if (this.events.eventName) {
            this.events.eventName.forEach(callback => callback(data));
        }
    },
    subscribe: function(eventName, callback) {
        if (!Array.isArray(events.eventName)){
            this.events.eventName = [];
        }
        this.events.eventName.push(callback);
    },
}

export {pubsub};