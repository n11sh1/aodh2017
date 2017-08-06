import {SpeakerNameType} from './speaker-name-type';

/**
 * AiTalk's WebAPI POST DATA
 */
export class AiTalk {
  public type: SpeakerNameType;
  public text: string;

  constructor(type: SpeakerNameType, text: string) {
    this.type = type;
    this.text = text;
  }
}
