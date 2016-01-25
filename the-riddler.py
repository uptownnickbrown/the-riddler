import numpy
import matplotlib.pyplot as plt
from tqdm import tqdm

taskLengths = range(1,6)
def runTrial():
    minutesSinceOpening = 0
    # Get length for the first task
    amIStillBusy = numpy.random.choice(taskLengths)
    #print 'my first task is ' + str(amIStillBusy) + ' minutes long'
    isSheStillBusy = numpy.random.choice(taskLengths)
    #print 'her first task is ' + str(isSheStillBusy) + ' minutes long'
    # This is the result of a trial run, -1 until we line up
    minutesUntilWeEat = -1
    while (minutesUntilWeEat == -1):
        minutesSinceOpening += 1
        #print str(minutesSinceOpening) + ' minutes have passed'
        amIStillBusy -= 1
        #print 'I\'ll still be busy for ' + str(amIStillBusy) + ' mins'
        isSheStillBusy -= 1
        #print 'She\'ll still be busy for ' + str(isSheStillBusy) + ' mins'
        if (amIStillBusy == 0 and isSheStillBusy == 0):
            #print 'Let\'s go eat! ' + str(minutesSinceOpening) + ' total mins until we were ready'
            minutesUntilWeEat = minutesSinceOpening
            break
        if (amIStillBusy == 0):
            amIStillBusy = numpy.random.choice(taskLengths)
            #print 'I\'m done but she isn\'t. New task for me! ' + str(amIStillBusy) + ' minutes long'
        if (isSheStillBusy == 0):
            isSheStillBusy = numpy.random.choice(taskLengths)
            #print 'She\'s done but I\'m not. New task for her! ' + str(isSheStillBusy) + ' minutes long'
    return minutesUntilWeEat
results = []
for i in tqdm(range(1,1000001)):
    trialResult = runTrial()
    results.append(trialResult)
    # print 'trial ' + str(i) + ': ' + str(trialResult)
    i += 1
meanResult = numpy.mean(results)
minResult = numpy.min(results)
maxResult = numpy.max(results)
print 'Average is ' + str(meanResult) + ', max time is ' + str(maxResult) + ', min time is ' + str(minResult)
plt.hist(results, bins=maxResult)
plt.xlabel('Minutes until dinner')
plt.ylabel('# of trials')
plt.title('How long until we look up from our phones and eat?')
plt.show()
