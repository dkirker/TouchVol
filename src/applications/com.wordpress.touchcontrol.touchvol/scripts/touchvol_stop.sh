#!/bin/sh

count=$(/usr/bin/luna-send -f -n 1 palm://com.palm.applicationManager/running {} | grep -c com.wordpress.touchcontrol.touchvol)
for c in `seq 1 $count`	
do
	i=$(/usr/bin/luna-send -f -n 1 palm://com.palm.applicationManager/running {} | grep -A 1 com.wordpress.touchcontrol.touchvol | sed -n '2p' | cut -d: -f2 | tr -d '"'| tr -d ' ')
	/usr/bin/luna-send -n 1 palm://com.palm.applicationManager/close '{"processId":"'$i'"}'
done
