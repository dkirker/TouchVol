#!/bin/sh

LOG=/media/internal/touchvol-patch.log

echo "===================================" >> $LOG
echo "Install: `date`" >> $LOG
echo "===================================" >> $LOG

DEST_FILE=/etc/palm/luna-platform.conf
BACKUP_NAME=$DEST_FILE.touchvol-backup
if [ -f $DEST_FILE ]; then
	line=$(grep -F -n [LaunchAtBoot] $DEST_FILE| cut -d: -f1)
	if [ $line ]; then
		echo "Found $DEST_FILE, backing up as $BACKUP_NAME" >> $LOG
		cp -f $DEST_FILE $BACKUP_NAME
		line=$((line + 1))
		sed -i "$line s/$/;com.wordpress.touchcontrol.touchvol/" $DEST_FILE
		line2=$(grep -F -n [KeepAlive] $DEST_FILE| cut -d: -f1)
		if [ $line2 ]; then
			line2=$((line2 + 1))
			sed -i "$line2 s/$/;com.wordpress.touchcontrol.touchvol/" $DEST_FILE
		fi
		echo "Changes applied to $DEST_FILE" >> $LOG
		echo "Diff:  ===========================" >> $LOG
		diff $DEST_FILE $BACKUP_NAME >> $LOG
		echo "====================================" >> $LOG
		echo "Done"
		exit 0
	else
		echo "LaunchAtBoot Section not found in $DEST_FILE. " >> $LOG
	fi
else
	echo "$DEST_FILE not found.  Thats odd. " >> $LOG
fi

line=
line2=

DEST_FILE=/etc/palm/luna.conf
BACKUP_NAME=$DEST_FILE.touchvol-backup
if [ -f $DEST_FILE ]; then
	line=$(grep -F -n [LaunchAtBoot] $DEST_FILE| cut -d: -f1)
	if [ $line ]; then
		echo "Found $DEST_FILE, backing up as $BACKUP_NAME" >> $LOG
		cp -f $DEST_FILE $BACKUP_NAME
		line=$((line + 1))
		sed -i "$line s/$/;com.wordpress.touchcontrol.touchvol/" $DEST_FILE
		line2=$(grep -F -n [KeepAlive] $DEST_FILE| cut -d: -f1)
		if [ $line2 ]; then
			line2=$((line2 + 1))
			sed -i "$line2 s/$/;com.wordpress.touchcontrol.touchvol/" $DEST_FILE
		fi
		echo "Changes applied to $DEST_FILE" >> $LOG
		echo "Diff:  ===========================" >> $LOG
		diff $DEST_FILE $BACKUP_NAME >> $LOG
		echo "====================================" >> $LOG
		echo "Done"
		exit 0
	else 
		echo "LaunchAtBoot Section not found in $DEST_FILE. " >> $LOG
	fi
else
	echo "$DEST_FILE not found.  Thats odd. " >> $LOG
fi

echo "Patch not applied."  >> $LOG
exit 1
