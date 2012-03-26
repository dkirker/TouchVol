#!/bin/sh
# This backs up the ucm case and removes the Headphone Volume Adjustments from all cases
LOG=/media/internal/touchvol-patch.log

echo "===================================" >> $LOG
echo "Reset UCM: `date`" >> $LOG
echo "===================================" >> $LOG

DEST_FILE=/usr/share/alsa/ucm/msm-audio/msm_media_case
BACKUP_NAME=$DEST_FILE.touchvol-backup
if [ -f $BACKUP_NAME ]; then
	echo "Found $BACKUP_NAME, restoring to $DEST_NAME" >> $LOG
		cp -f $BACKUP_NAME $DEST_FILE
	fi
	echo "Changes applied to $DEST_FILE" >> $LOG
	echo "Diff:  ===========================" >> $LOG
	diff $DEST_FILE $BACKUP_NAME >> $LOG
	echo "====================================" >> $LOG
	echo "Done"
	exit 0
else
	echo "$BACKUP_NAME not found.  Thats bad. " >> $LOG
	echo "Check /usr/share/alsa/ucm/msm-audio for misnamed backups" >> $LOG
	echo "otherwise you need to restore msm_media_case from Doctor image." >> $LOG
	exit 1
fi