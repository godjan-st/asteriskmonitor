#!/bin/bash

SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  DIR="$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
DIR="$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )"
echo "My working dir: $DIR"

if (ps ax | grep 'meteor' | grep -v 'grep' | grep -v 'mongo' | grep -v 'check_meteor') >/dev/null
then
    echo "Meteor.js is running"
else
    echo 'gamno'
    curl -k -X POST https://149.154.167.220/bot1635603775:AAFZjgFqzSbiFF7EyQmwwEa54up_gqAj2GI/sendMessage -d chat_id=-1001305322330 -d text="Процесс meteor (конференции) был остановлен по неизвестной причине и запущен заново"
    cd $DIR && nohup su -c meteor pbxmonuser &
    #nohup python $_cwd/manage.py ringer_worker &
    #echo "ringer_worker is stopped!"
fi