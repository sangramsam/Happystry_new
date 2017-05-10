angular.module('Happystry.services').service('msgServices', function (Settings) {
    var msgList = [];
    var notifyList = [];
    this.msgAddFxn = function (data) {
        msgList.splice(0, 0, {'message': data.msg, 'cret_date': data.date_time, 'me': 1})
        return msgList;
    },
        this.msgListFxn = function (data) {
            msgList = data;
            return msgList;
        },
        this.notifyListFxn = function (data) {
            notifyList = data;
            return notifyList;
        },
        this.notifyReadFxn = function (data) {
            for (i in notifyList) {
                if (notifyList[i].user_id === data.user_id) {
                    notifyList[i].msgcount = 0;
                }
            }

            return notifyList;
        }
});