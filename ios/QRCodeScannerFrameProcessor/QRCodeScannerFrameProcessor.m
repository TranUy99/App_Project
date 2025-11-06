#import <VisionCamera/FrameProcessorPlugin.h>
#import <VisionCamera/FrameProcessorPluginRegistry.h>

#if __has_include("HAdelivery/HAdelivery-Swift.h")
#import "HAdelivery/HAdelivery-Swift.h"
#else
#import "HAdelivery-Swift.h"
#endif

VISION_EXPORT_SWIFT_FRAME_PROCESSOR(QRCodeScannerFrameProcessorPlugin, QRCodeScanner)