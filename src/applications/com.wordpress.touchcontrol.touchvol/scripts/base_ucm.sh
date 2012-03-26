#!/bin/sh
# This backs up the ucm case and removes the lines matching the input argument from the media case file.
LOG=/media/internal/touchvol-patch.log

if [ $# -lt 1 ]; then
	echo "1 or more arguments required, $# given" >> $LOG
	exit 1
fi

for i in "$@"
do
	echo "===================================" >> $LOG
	echo "$i Patch Install: `date`" >> $LOG
	echo "===================================" >> $LOG
done
DEST_FILE=/usr/share/alsa/ucm/msm-audio/msm_media_case
BACKUP_NAME=$DEST_FILE.touchvol-backup
if [ -f $DEST_FILE ]; then

	if [ -f $BACKUP_NAME ]; then
		echo "Found existing backup file $BACKUP_NAME" >> $LOG
	else
		echo "Found $DEST_FILE, backing up as $BACKUP_NAME" >> $LOG
		cp -f $DEST_FILE $BACKUP_NAME
	fi
	for i in "$@"
	do
		sed -i "/$i/d" $DEST_FILE
	done
	echo "Changes applied to $DEST_FILE" >> $LOG
	echo "Diff:  ===========================" >> $LOG
	diff $DEST_FILE $BACKUP_NAME >> $LOG
	echo "====================================" >> $LOG
	echo "Done"
	exit 0
else
	echo "$DEST_FILE not found.  Thats odd. " >> $LOG
fi