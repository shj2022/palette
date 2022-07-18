//% weight=100 color=#08415d icon="\uf1ae"
namespace activityRecognition {

    //  copy & paste the below from the ML training code
    let scaler_mean = [-506.48981805458357, 776.7355843247025, -166.70332400279918, 438.10171133654177, 486.53118245627076, 401.9925953933955, -1262.3554933519945, 22.869139258222532, -884.2309307207838, 120.66969909027291, 1580.4527641707489, 492.2771168649405]
    let scaler_sd = [207.3851781629063, 269.60440742210716, 191.57746757936448, 373.9213070540243, 423.6681328884729, 391.9097934142554, 689.7265263727425, 890.8134575686838, 834.1892942979952, 445.0867703028813, 429.64836881670925, 522.3949921513964]
    let coef = [[2.889619760745056, 2.8203894625846715, 2.7811074464187584, -3.1870484987043746, 1.5507015623468874, 1.152937585031843, -4.693891938701659, 6.500557483371374, -1.9357856925798416, 1.3344727237087, 1.2422189980763392, -4.800340537936975], [0.06871634662314981, -0.1506406698080609, -0.08702658179901329, 0.18490174327119852, 0.20211894033874678, 0.10905916921116622, -0.15016117594154155, -0.11621472341174627, -0.16117633291187036, 0.229856240922358, 0.28778596302494175, 0.15287811244833277], [0.13493028170120003, -0.076220313031651, -0.09497403973655993, 0.3941280704624175, 0.42066511789252276, 0.17908260530169834, -0.1688851696564455, -0.17266570806763576, 0.08880913780859112, 0.5124157191226222, 0.40517785702232423, 1.0659368500402837], [0.11940471590683713, -0.22296648233035354, -0.0701257097973167, 0.2864485713405017, 0.39903636769253265, 0.15216656533770187, 0.09076394310348401, 0.03948216376592539, -0.13440371295899656, 0.35141469492678956, 0.902665937534973, -0.1489202983245993], [0.021884373269317317, -0.2163009376705872, -0.16879395343155812, 0.15441426643337117, 0.13620881786658623, 0.155194830475672, -0.09135650192111619, -0.16246606924313495, -0.17490584411910123, 0.17156292819394892, 0.0688714420949196, 0.2041992474229843], [0.14664107932676407, 0.015768607174627913, -0.21264134580904326, 0.11550802581605712, 0.3187236154679469, 0.5940812780800044, -0.1693819109684891, -0.3535417146590217, -0.5139065266938592, 0.18907940045891503, 0.007537003432690037, 1.5407222439379307], [0.6914542625135396, -2.7990307887687393, 1.9480741557224093, 2.3583840864181873, -0.5028662047553414, 2.6517248430776004, -0.08229577827574275, 0.04320590846221961, 0.020280744676995255, 5.229845641833412, -0.23898531882841567, -0.05424557485505943], [-0.8650100576384592, 8.177349122494935, -3.120957419541554, -6.345439999339646, -5.458854798645703, 7.758814885810509, -1.4649834875339138, -3.12418991297325, 2.1125035753870627, -6.423566582643261, -2.8359366034786717, -0.48880296952937385], [-0.8472412128022185, -6.85843190922926, -2.875413319984929, -2.091364105063249, -4.71638721792813, -5.132520222913321, 2.2073081793406004, 0.1693667311867273, 0.399027000523283, -0.11379811056796996, -4.002349368732013, -1.0158472934393643], [-5.46096325123699, -20.95445326572559, 9.072026951336312, -1.323420417962211, -10.235832126629134, -8.02126645067409, 5.544965887431033, -4.0309674698808635, -6.592511315000394, 5.419558136431647, 7.451327270970296, -3.372855565090333]]
    let k = [10.465180807667947, -0.06922273780037173, -0.4013713977059473, -0.8139304488300502, -0.33714675101960045, -1.1646104390944723, 0.19395534419331176, -13.923662592159209, -12.81517692800278, 8.052019563507798]
    let activities = ['d', 'r', 's', 't', 'w']

    //  raw accelerometer data collection by timestamp (100ms)
    let rawX: number[] = []
    let rawY: number[] = []
    let rawZ: number[] = []
    let current_activity = "start"

    //  define mathematical functions
    function average(list1: number[]): number {
        let sum = 0
        for (let value of list1) {
            sum += value
        }
        return sum / list1.length
    }

    function sd(list2: number[]): number {
        let x = 0
        for (let value of list2) {
            x += (value - average(list2)) ** 2
        }
        return Math.sqrt(x / list2.length)
    }

    function minimum(list3: number[]): number {
        let val = list3[0]
        for (let value of list3) {
            val = Math.min(val, value)
        }
        return val
    }

    function maximum(list4: number[]): number {
        let val2 = list4[0]
        for (let value of list4) {
            val2 = Math.max(val2, value)
        }
        return val2
    }

    // define features: feature_package order: avg x,y,z, sd x,y,z, min x,y,z, max x,y,z
    function feature_package(listx: number[], listy: number[], listz: number[]): any[] {
        let to_return = []
        to_return.push((average(listx) - scaler_mean[0]) / scaler_sd[0])
        to_return.push((average(listy) - scaler_mean[1]) / scaler_sd[1])
        to_return.push((average(listz) - scaler_mean[2]) / scaler_sd[2])
        to_return.push((sd(listx) - scaler_mean[3]) / scaler_sd[3])
        to_return.push((sd(listy) - scaler_mean[4]) / scaler_sd[4])
        to_return.push((sd(listz) - scaler_mean[5]) / scaler_sd[5])
        to_return.push((minimum(listx) - scaler_mean[6]) / scaler_sd[6])
        to_return.push((minimum(listy) - scaler_mean[7]) / scaler_sd[7])
        to_return.push((minimum(listz) - scaler_mean[8]) / scaler_sd[8])
        to_return.push((maximum(listx) - scaler_mean[9]) / scaler_sd[9])
        to_return.push((maximum(listy) - scaler_mean[10]) / scaler_sd[10])
        to_return.push((maximum(listz) - scaler_mean[11]) / scaler_sd[11])
        return to_return
    }

    //  define function that predicts class of a feature package (array of 12 elements computed from 20 data points 0.1 sec apart)
    function predict(list5: number[]): number {
        let i: number;
        let dot_product: number;
        let j: number;
        let votingPool: number[] = []
        for (i = 0; i < coef.length; i++) {
            dot_product = 0
            for (j = 0; j < 12; j++) {
                dot_product += coef[i][j] * list5[j]
            }
            if (dot_product + k[i] > 0) {
                votingPool.push(1)
            } else {
                votingPool.push(0)
            }

        }
        let currentIndex = 0
        let votes: number[] = []
        for (i = 0; i < activities.length - 1; i++) {
            for (j = i + 1; j < activities.length; j++) {
                if (votingPool[currentIndex] == 1) {
                    votes.push(i)
                } else {
                    votes.push(j)
                }

                currentIndex += 1
            }
        }
        let count: number[] = []
        for (i=0; i<activities.length; i++){
            count.push(0)
        }
        for (i = 0; i < votes.length; i++) {
            count[votes[i]] += 1
        }
        return _py.py_array_index(count, maximum(count))
    }

    control.inBackground(() => {
        for (let index = 0; index < 19; index++) {
            rawX.push(input.acceleration(Dimension.X))
            rawY.push(input.acceleration(Dimension.Y))
            rawZ.push(input.acceleration(Dimension.Z))
            basic.pause(97)
        }
        while (true) {
            rawX.push(input.acceleration(Dimension.X))
            rawY.push(input.acceleration(Dimension.Y))
            rawZ.push(input.acceleration(Dimension.Z))
            basic.pause(97)
            current_activity = activities[predict(feature_package(rawX, rawY, rawZ))]
            rawX.removeAt(0)
            rawY.removeAt(0)
            rawZ.removeAt(0)
        }
    }
    )

    loops.everyInterval(1000, function () {
        datalogger.log(datalogger.createCV("activity type", current_activity))
    })

    datalogger.onLogFull(function () {
        datalogger.deleteLog(datalogger.DeleteType.Full)
    })

    //  every 0.1 sec: collect acceleration data, update
    //% block
    export function findActivity(): string {
        return current_activity
    }

    // block that shows string for 1 millisecond: if you use the default show string block it will display for ~1 second and cause a backlog of strings to display
    //% block
    export function show(s: string): void {
        basic.showString(s, 1);
    }
}