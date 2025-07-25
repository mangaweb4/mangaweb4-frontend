// @generated by protobuf-ts 2.11.1
// @generated from protobuf file "tag.proto" (syntax proto3)
// tslint:disable
import { ServiceType } from "@protobuf-ts/runtime-rpc";
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { SortOrder } from "./types";
import { SortField } from "./types";
import { Filter } from "./types";
/**
 * @generated from protobuf message TagListRequest
 */
export interface TagListRequest {
    /**
     * @generated from protobuf field: string User = 1
     */
    user: string;
    /**
     * @generated from protobuf field: mangaweb4.types.Filter Filter = 3
     */
    filter: Filter;
    /**
     * @generated from protobuf field: int32 Page = 4
     */
    page: number;
    /**
     * @generated from protobuf field: int32 ItemPerPage = 5
     */
    itemPerPage: number;
    /**
     * @generated from protobuf field: string Search = 6
     */
    search: string;
    /**
     * @generated from protobuf field: mangaweb4.types.SortField Sort = 7
     */
    sort: SortField;
    /**
     * @generated from protobuf field: mangaweb4.types.SortOrder Order = 8
     */
    order: SortOrder;
}
/**
 * @generated from protobuf message TagListResponse
 */
export interface TagListResponse {
    /**
     * @generated from protobuf field: bool TagFavorite = 1
     */
    tagFavorite: boolean;
    /**
     * @generated from protobuf field: int32 TotalPage = 2
     */
    totalPage: number;
    /**
     * @generated from protobuf field: repeated TagListResponseItem Items = 3
     */
    items: TagListResponseItem[];
}
/**
 * @generated from protobuf message TagListResponseItem
 */
export interface TagListResponseItem {
    /**
     * @generated from protobuf field: int32 Id = 1
     */
    id: number;
    /**
     * @generated from protobuf field: string Name = 2
     */
    name: string;
    /**
     * @generated from protobuf field: bool IsFavorite = 3
     */
    isFavorite: boolean;
    /**
     * @generated from protobuf field: bool IsRead = 4
     */
    isRead: boolean;
    /**
     * @generated from protobuf field: int32 PageCount = 5
     */
    pageCount: number;
    /**
     * @generated from protobuf field: bool HasFavoriteTag = 6
     */
    hasFavoriteTag: boolean;
}
/**
 * @generated from protobuf message TagThumbnailRequest
 */
export interface TagThumbnailRequest {
    /**
     * @generated from protobuf field: string Name = 1
     */
    name: string;
}
/**
 * @generated from protobuf message TagThumbnailResponse
 */
export interface TagThumbnailResponse {
    /**
     * @generated from protobuf field: string ContentType = 1
     */
    contentType: string;
    /**
     * @generated from protobuf field: bytes Data = 2
     */
    data: Uint8Array;
}
/**
 * @generated from protobuf message TagSetFavoriteRequest
 */
export interface TagSetFavoriteRequest {
    /**
     * @generated from protobuf field: string User = 1
     */
    user: string;
    /**
     * @generated from protobuf field: string Tag = 2
     */
    tag: string;
    /**
     * @generated from protobuf field: bool Favorite = 3
     */
    favorite: boolean;
}
/**
 * @generated from protobuf message TagSetFavoriteResponse
 */
export interface TagSetFavoriteResponse {
    /**
     * @generated from protobuf field: string Tag = 1
     */
    tag: string;
    /**
     * @generated from protobuf field: bool Favorite = 2
     */
    favorite: boolean;
}
// @generated message type with reflection information, may provide speed optimized methods
class TagListRequest$Type extends MessageType<TagListRequest> {
    constructor() {
        super("TagListRequest", [
            { no: 1, name: "User", kind: "scalar", jsonName: "User", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "Filter", kind: "enum", jsonName: "Filter", T: () => ["mangaweb4.types.Filter", Filter, "FILTER_"] },
            { no: 4, name: "Page", kind: "scalar", jsonName: "Page", T: 5 /*ScalarType.INT32*/ },
            { no: 5, name: "ItemPerPage", kind: "scalar", jsonName: "ItemPerPage", T: 5 /*ScalarType.INT32*/ },
            { no: 6, name: "Search", kind: "scalar", jsonName: "Search", T: 9 /*ScalarType.STRING*/ },
            { no: 7, name: "Sort", kind: "enum", jsonName: "Sort", T: () => ["mangaweb4.types.SortField", SortField, "SORT_FIELD_"] },
            { no: 8, name: "Order", kind: "enum", jsonName: "Order", T: () => ["mangaweb4.types.SortOrder", SortOrder, "SORT_ORDER_"] }
        ]);
    }
    create(value?: PartialMessage<TagListRequest>): TagListRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.user = "";
        message.filter = 0;
        message.page = 0;
        message.itemPerPage = 0;
        message.search = "";
        message.sort = 0;
        message.order = 0;
        if (value !== undefined)
            reflectionMergePartial<TagListRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TagListRequest): TagListRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string User */ 1:
                    message.user = reader.string();
                    break;
                case /* mangaweb4.types.Filter Filter */ 3:
                    message.filter = reader.int32();
                    break;
                case /* int32 Page */ 4:
                    message.page = reader.int32();
                    break;
                case /* int32 ItemPerPage */ 5:
                    message.itemPerPage = reader.int32();
                    break;
                case /* string Search */ 6:
                    message.search = reader.string();
                    break;
                case /* mangaweb4.types.SortField Sort */ 7:
                    message.sort = reader.int32();
                    break;
                case /* mangaweb4.types.SortOrder Order */ 8:
                    message.order = reader.int32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: TagListRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string User = 1; */
        if (message.user !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.user);
        /* mangaweb4.types.Filter Filter = 3; */
        if (message.filter !== 0)
            writer.tag(3, WireType.Varint).int32(message.filter);
        /* int32 Page = 4; */
        if (message.page !== 0)
            writer.tag(4, WireType.Varint).int32(message.page);
        /* int32 ItemPerPage = 5; */
        if (message.itemPerPage !== 0)
            writer.tag(5, WireType.Varint).int32(message.itemPerPage);
        /* string Search = 6; */
        if (message.search !== "")
            writer.tag(6, WireType.LengthDelimited).string(message.search);
        /* mangaweb4.types.SortField Sort = 7; */
        if (message.sort !== 0)
            writer.tag(7, WireType.Varint).int32(message.sort);
        /* mangaweb4.types.SortOrder Order = 8; */
        if (message.order !== 0)
            writer.tag(8, WireType.Varint).int32(message.order);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message TagListRequest
 */
export const TagListRequest = new TagListRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TagListResponse$Type extends MessageType<TagListResponse> {
    constructor() {
        super("TagListResponse", [
            { no: 1, name: "TagFavorite", kind: "scalar", jsonName: "TagFavorite", T: 8 /*ScalarType.BOOL*/ },
            { no: 2, name: "TotalPage", kind: "scalar", jsonName: "TotalPage", T: 5 /*ScalarType.INT32*/ },
            { no: 3, name: "Items", kind: "message", jsonName: "Items", repeat: 2 /*RepeatType.UNPACKED*/, T: () => TagListResponseItem }
        ]);
    }
    create(value?: PartialMessage<TagListResponse>): TagListResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tagFavorite = false;
        message.totalPage = 0;
        message.items = [];
        if (value !== undefined)
            reflectionMergePartial<TagListResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TagListResponse): TagListResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bool TagFavorite */ 1:
                    message.tagFavorite = reader.bool();
                    break;
                case /* int32 TotalPage */ 2:
                    message.totalPage = reader.int32();
                    break;
                case /* repeated TagListResponseItem Items */ 3:
                    message.items.push(TagListResponseItem.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: TagListResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* bool TagFavorite = 1; */
        if (message.tagFavorite !== false)
            writer.tag(1, WireType.Varint).bool(message.tagFavorite);
        /* int32 TotalPage = 2; */
        if (message.totalPage !== 0)
            writer.tag(2, WireType.Varint).int32(message.totalPage);
        /* repeated TagListResponseItem Items = 3; */
        for (let i = 0; i < message.items.length; i++)
            TagListResponseItem.internalBinaryWrite(message.items[i], writer.tag(3, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message TagListResponse
 */
export const TagListResponse = new TagListResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TagListResponseItem$Type extends MessageType<TagListResponseItem> {
    constructor() {
        super("TagListResponseItem", [
            { no: 1, name: "Id", kind: "scalar", jsonName: "Id", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "Name", kind: "scalar", jsonName: "Name", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "IsFavorite", kind: "scalar", jsonName: "IsFavorite", T: 8 /*ScalarType.BOOL*/ },
            { no: 4, name: "IsRead", kind: "scalar", jsonName: "IsRead", T: 8 /*ScalarType.BOOL*/ },
            { no: 5, name: "PageCount", kind: "scalar", jsonName: "PageCount", T: 5 /*ScalarType.INT32*/ },
            { no: 6, name: "HasFavoriteTag", kind: "scalar", jsonName: "HasFavoriteTag", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
    create(value?: PartialMessage<TagListResponseItem>): TagListResponseItem {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.id = 0;
        message.name = "";
        message.isFavorite = false;
        message.isRead = false;
        message.pageCount = 0;
        message.hasFavoriteTag = false;
        if (value !== undefined)
            reflectionMergePartial<TagListResponseItem>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TagListResponseItem): TagListResponseItem {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* int32 Id */ 1:
                    message.id = reader.int32();
                    break;
                case /* string Name */ 2:
                    message.name = reader.string();
                    break;
                case /* bool IsFavorite */ 3:
                    message.isFavorite = reader.bool();
                    break;
                case /* bool IsRead */ 4:
                    message.isRead = reader.bool();
                    break;
                case /* int32 PageCount */ 5:
                    message.pageCount = reader.int32();
                    break;
                case /* bool HasFavoriteTag */ 6:
                    message.hasFavoriteTag = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: TagListResponseItem, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* int32 Id = 1; */
        if (message.id !== 0)
            writer.tag(1, WireType.Varint).int32(message.id);
        /* string Name = 2; */
        if (message.name !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.name);
        /* bool IsFavorite = 3; */
        if (message.isFavorite !== false)
            writer.tag(3, WireType.Varint).bool(message.isFavorite);
        /* bool IsRead = 4; */
        if (message.isRead !== false)
            writer.tag(4, WireType.Varint).bool(message.isRead);
        /* int32 PageCount = 5; */
        if (message.pageCount !== 0)
            writer.tag(5, WireType.Varint).int32(message.pageCount);
        /* bool HasFavoriteTag = 6; */
        if (message.hasFavoriteTag !== false)
            writer.tag(6, WireType.Varint).bool(message.hasFavoriteTag);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message TagListResponseItem
 */
export const TagListResponseItem = new TagListResponseItem$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TagThumbnailRequest$Type extends MessageType<TagThumbnailRequest> {
    constructor() {
        super("TagThumbnailRequest", [
            { no: 1, name: "Name", kind: "scalar", jsonName: "Name", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<TagThumbnailRequest>): TagThumbnailRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.name = "";
        if (value !== undefined)
            reflectionMergePartial<TagThumbnailRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TagThumbnailRequest): TagThumbnailRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string Name */ 1:
                    message.name = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: TagThumbnailRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string Name = 1; */
        if (message.name !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.name);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message TagThumbnailRequest
 */
export const TagThumbnailRequest = new TagThumbnailRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TagThumbnailResponse$Type extends MessageType<TagThumbnailResponse> {
    constructor() {
        super("TagThumbnailResponse", [
            { no: 1, name: "ContentType", kind: "scalar", jsonName: "ContentType", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "Data", kind: "scalar", jsonName: "Data", T: 12 /*ScalarType.BYTES*/ }
        ]);
    }
    create(value?: PartialMessage<TagThumbnailResponse>): TagThumbnailResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.contentType = "";
        message.data = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<TagThumbnailResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TagThumbnailResponse): TagThumbnailResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string ContentType */ 1:
                    message.contentType = reader.string();
                    break;
                case /* bytes Data */ 2:
                    message.data = reader.bytes();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: TagThumbnailResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string ContentType = 1; */
        if (message.contentType !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.contentType);
        /* bytes Data = 2; */
        if (message.data.length)
            writer.tag(2, WireType.LengthDelimited).bytes(message.data);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message TagThumbnailResponse
 */
export const TagThumbnailResponse = new TagThumbnailResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TagSetFavoriteRequest$Type extends MessageType<TagSetFavoriteRequest> {
    constructor() {
        super("TagSetFavoriteRequest", [
            { no: 1, name: "User", kind: "scalar", jsonName: "User", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "Tag", kind: "scalar", jsonName: "Tag", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "Favorite", kind: "scalar", jsonName: "Favorite", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
    create(value?: PartialMessage<TagSetFavoriteRequest>): TagSetFavoriteRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.user = "";
        message.tag = "";
        message.favorite = false;
        if (value !== undefined)
            reflectionMergePartial<TagSetFavoriteRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TagSetFavoriteRequest): TagSetFavoriteRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string User */ 1:
                    message.user = reader.string();
                    break;
                case /* string Tag */ 2:
                    message.tag = reader.string();
                    break;
                case /* bool Favorite */ 3:
                    message.favorite = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: TagSetFavoriteRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string User = 1; */
        if (message.user !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.user);
        /* string Tag = 2; */
        if (message.tag !== "")
            writer.tag(2, WireType.LengthDelimited).string(message.tag);
        /* bool Favorite = 3; */
        if (message.favorite !== false)
            writer.tag(3, WireType.Varint).bool(message.favorite);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message TagSetFavoriteRequest
 */
export const TagSetFavoriteRequest = new TagSetFavoriteRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class TagSetFavoriteResponse$Type extends MessageType<TagSetFavoriteResponse> {
    constructor() {
        super("TagSetFavoriteResponse", [
            { no: 1, name: "Tag", kind: "scalar", jsonName: "Tag", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "Favorite", kind: "scalar", jsonName: "Favorite", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
    create(value?: PartialMessage<TagSetFavoriteResponse>): TagSetFavoriteResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.tag = "";
        message.favorite = false;
        if (value !== undefined)
            reflectionMergePartial<TagSetFavoriteResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TagSetFavoriteResponse): TagSetFavoriteResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string Tag */ 1:
                    message.tag = reader.string();
                    break;
                case /* bool Favorite */ 2:
                    message.favorite = reader.bool();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: TagSetFavoriteResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* string Tag = 1; */
        if (message.tag !== "")
            writer.tag(1, WireType.LengthDelimited).string(message.tag);
        /* bool Favorite = 2; */
        if (message.favorite !== false)
            writer.tag(2, WireType.Varint).bool(message.favorite);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message TagSetFavoriteResponse
 */
export const TagSetFavoriteResponse = new TagSetFavoriteResponse$Type();
/**
 * @generated ServiceType for protobuf service Tag
 */
export const Tag = new ServiceType("Tag", [
    { name: "List", options: {}, I: TagListRequest, O: TagListResponse },
    { name: "Thumbnail", options: {}, I: TagThumbnailRequest, O: TagThumbnailResponse },
    { name: "SetFavorite", options: {}, I: TagSetFavoriteRequest, O: TagSetFavoriteResponse }
]);
