import { computed, onMounted, ref, type MaybeRefOrGetter, toValue } from 'vue'
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter'
import { disableNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview'
import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source'

type DraggableParams = Omit<Parameters<typeof draggable>[0], 'element'>

type Point = { x: number; y: number }

export function usePdndDraggable(
	element: MaybeRefOrGetter<HTMLElement | null>,
	options: DraggableParams
) {
	const { onDrag, onDrop, onDragStart, getInitialData } = options
	const isDragging = ref(false)

	const initialDragOffset = ref<Point>({ x: 0, y: 0 })
	const dragCoordinates = ref<null | Point>(null)
	const positionStyleString = computed(() => {
		return dragCoordinates.value
			? `left: ${dragCoordinates.value.x}px; top: ${dragCoordinates.value.y}px`
			: ''
	})

	onMounted(() => {
		if (!toValue(element)) {
			console.error('no element')
			return
		}

		draggable({
			element: toValue(element)!,
			getInitialData: getInitialData,
			onGenerateDragPreview: ({ nativeSetDragImage }) => {
				disableNativeDragPreview({
					nativeSetDragImage
				})
			},
			onDragStart: (args) => {
				const offsetFn = preserveOffsetOnSource({
					element: toValue(element)!,
					input: args.location.initial.input
				})

				initialDragOffset.value = offsetFn({ container: toValue(element)! })

				isDragging.value = true
				onDragStart?.(args)
			},
			onDrag: (args) => {
				dragCoordinates.value = {
					x: args.location.current.input.clientX - initialDragOffset.value.x,
					y: args.location.current.input.clientY - initialDragOffset.value.y
				}
				onDrag?.(args)
			},
			onDrop: (args) => {
				isDragging.value = false

				onDrop?.(args)
			}
		})
	})

	return { isDragging, positionStyleString, dragCoordinates }
}
