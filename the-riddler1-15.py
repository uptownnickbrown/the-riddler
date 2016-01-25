from __future__ import division
import numpy
import matplotlib.pyplot as plt
from tqdm import tqdm

# A basketball player is in the gym practicing free throws.
# He makes his first shot, then misses his second. This player
# tends to get inside his own head a little bit, so this isn't
# good news. Specifically, the probability he hits any
# subsequent shot is equal to the overall percentage of shots
# that he's made thus far. (His neuroses are very exacting.)
# His coach, who knows his psychological tendency and saw the
# first two shots, leaves the gym and doesn't see the next
# 96 shots. The coach returns, and sees the player make shot
# No. 99. What is the probability, from the coach's point of
# view, that he makes shot No. 100?

def runTrial():
    trial = {}

    freeThrowHistory = [1,0]
    percentHistory = []
    while (len(freeThrowHistory) < 99):
        # Shoot another throw
        currentThrow = numpy.random.choice(freeThrowHistory)
        percentHistory.append(numpy.mean(freeThrowHistory))
        freeThrowHistory.append(currentThrow)

    # percentage after 99 throws
    finalPercentage = numpy.mean(freeThrowHistory)
    percentHistory.append(finalPercentage)

    # print finalPercentage
    # print freeThrowHistory

    madeLast = 0
    # In these cases, the coach saw him hit throw 99
    if (freeThrowHistory[98] == 1):
        madeLast = 1

    trial["madeLast"] = madeLast
    trial["percentage"] = finalPercentage
    trial["percentHistory"] = percentHistory

    return trial

trials = []

for i in tqdm(range(1,1000001)):
    trialResult = runTrial()
    trials.append(trialResult)
    # print 'trial ' + str(i) + ': ' + str(trialResult)
    plt.figure(1)
    plt.plot(range(1,99),trialResult["percentHistory"], alpha=0.00015, color = '#666666')
    if (trialResult['madeLast'] == 1):
        plt.figure(2)
        plt.plot(range(1,99),trialResult["percentHistory"], alpha=0.00015, color = '#666666')
    i += 1

# mean percentage after all cases
print "All cases: " + str(numpy.mean([trial['percentage'] for trial in trials]))
print "Trial cases: " + str(numpy.mean([trial['percentage'] for trial in trials if trial['madeLast'] == 1]))

plt.figure(1)
plt.ylim(0,1)
plt.xlim(1,99)
plt.xlabel('# of Free Throw attempt')
plt.ylabel('% chance of making it')
plt.title('% chance of making it over time, all trials')
plt.savefig('allTrials.png', dpi=180)

plt.figure(2)
plt.ylim(0,1)
plt.xlim(1,99)
plt.xlabel('# of Free Throw attempt')
plt.ylabel('% chance of making it')
plt.title('% chance of making it over time, only trials where they made attempt 99')
plt.savefig('madeTrials.png', dpi=180)
#plt.show()
