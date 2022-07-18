input.onButtonPressed(Button.A, function () {
    activityRecognition.show(activityRecognition.findActivity())
})
input.onButtonPressed(Button.AB, function () {
    activity_level = 0
})
input.onButtonPressed(Button.B, function () {
    basic.showNumber(activity_level)
})
let activity_level = 0
activity_level = 0
basic.forever(function () {
    if (activityRecognition.findActivity() == "s") {
        activity_level += 0.1
    }
    if (activityRecognition.findActivity() == "w") {
        activity_level += 0.2
    }
    if (activityRecognition.findActivity() == "r") {
        activity_level += 0.3
    }
    if (activityRecognition.findActivity() == "t") {
        activity_level += 0.4
    }
    if (activityRecognition.findActivity() == "d") {
        activity_level += 0.1
    }
})
