#!/bin/sh

i=$(luna-send -f -n 1 palm://com.palm.applicationManager/running {} | grep -A 1 "com.wordpress.touchcontrol.touchvol" | grep processid | cut -d: -f2 | tr -d '"' | tr -d ' ')
index=0
for process in $i
do
		newprocs="$newprocs $process"
		index=$((index + 1))
done

if [ $index -gt 1 ]; then
	num=$(($index - 1))
	launcher=$(echo $newprocs| cut -d" " -f$num)
	/usr/bin/luna-send -n 1 palm://com.palm.applicationManager/close '{"processId":"'$launcher'"}'	
fi
