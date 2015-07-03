require 'rubygems'
require 'pushmeup'
GCM.host = 'https://android.googleapis.com/gcm/send'
GCM.format = :json
GCM.key = "AIzaSyCXhn2UkudhhnAm0_KAgUW0x5qgDW121Sg"
destination = ["APA91bEiDOomapqvUvw0-qCBT5Rb6H_BlV56ihmXmZ0uCi_I1Adjvthb7WM1z4gk-v0HwVuBCvmkCoO6x7b_jbdHy-FGc0ra6mi0qdFUQy9ZAEcTumAmLaWp-ezw0ZBa3IR7jTvpQC2uI5mJTqcbs32-R8pZcpKA0A"]
data = {:message => "PhoneGap Build rocks!", :msgcnt => "1", :soundname => "beep.wav"}

GCM.send_notification( destination, data)

